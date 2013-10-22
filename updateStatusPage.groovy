import groovy.text.SimpleTemplateEngine
// prerequisites groovy 1.8

// 
// utility functions and initializations
//

// status is 0 if OK (ping status) and not 0 otherwise  
def pingServer(target) { 
  def pingCommand = "ping -c 3 ${target}".execute()
  pingCommand.waitFor()
  pingCommand.exitValue() 
}

// status is 0 if OK (consistence with ping status) and not 0 otherwise  
def pingUrl(url) { 
    try {
      url.toURL().getText()
      0 
    } catch (Exception e) {
      //println (e.getMessage())
      -1   
    }
}


def outputStatusPage(outputFile, timestamp, json) { 
  def binding = [  date : timestamp, data : json ]
  String template = new File('template-status-page.html').text
  def engine = new SimpleTemplateEngine()
  def page = engine.createTemplate(template).make(binding)
  outputFile.delete()
  outputFile << page 
}

def keepon(current, max) { 
  (max < 0 ) || (max > 0 && current < max)
}


def outputFile = new File('status-page.html')


// 
// process
//

def services =
    [   [ 'protocol': 'ip', 'value': 'www.google.com', 'history':[] ],
        [ 'protocol': 'http', 'value': 'http://www.google.com', 'history':[]  ],
        [ 'protocol': 'ip', 'value': 'does not exist', 'history':[]  ],
        [ 'protocol': 'http', 'value': 'http://doesnotexist', 'history':[]  ]]

def readingCount = 0
def maxReadingCount = -1 // -1 stands for forever
def waitIntervalMn = 1
def done = false

while (keepon(readingCount, maxReadingCount)) {
  def timestamp = (new Date()).toString()
    println "at ${timestamp}"
  def statuses =  services.collect() { service ->
      println "checking ${service} ..."
      switch ( service.protocol ) {
          case 'ip':
              def status =  pingServer(service.value)
              service.history << (status>0?1:-1)
              service << [ 'status': status ]
              break
          case 'http':
              def status =  pingUrl(service.value)
              service.history << (status>-1?1:-1)
              service << [ 'status': status ]
              break
          default:
              println "undefined protocol ${service.type} ..."
      }
  }
  def json = new groovy.json.JsonBuilder(statuses).toString()
  //println json
  outputStatusPage(outputFile, timestamp, json)

  readingCount++

  if (keepon(readingCount, maxReadingCount)) { 
    println "waiting ${waitIntervalMn} mn ..."
    sleep waitIntervalMn * 60 * 1000
  }
}

