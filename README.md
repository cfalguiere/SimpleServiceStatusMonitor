# Simple Service Status Monitor

A simple service status monitor based on Groovy and D3


## Motivation

Nagios or other monitoring tools are great but they require some infrastructure (a web server, a database, a linux server …).

This tool is a very simple status monitor HTML page. It relies on very common components and does not require an infrastructure or a database. 

As a consequence, it has no memory and you should publish the HTML file in the Web Server to make it available to the network.

It is also a [D3](http://d3js.org/) demo.

## Overview

It consists in:
 
- an HTML page template 
- some [D3](http://d3js.org/) code to draw circles
- a script

When the script runs, it checks the services, build a json string and generate a new HTML page from the template.

![image](https://raw.github.com/cfalguiere/SimpleServiceStatusMonitor/master/doc/screenshot-white.png)

## Prerequisites

The tools relies only on a few very common components

- Groovy a Java based script langage. It's easy to setup. Check the [Groovy installation guide](http://groovy.codehaus.org/Installing+Groovy) .  
- [D3 library](http://d3js.org/) 

If Groovy is an issue, you may rewrite the script with another langage and share it. Check ["Implementation details"]("#implementation-details")



## Getting Started


### install


Clone the repository or download it as a [zip file]("https://github.com/cfalguiere/SimpleServiceStatusMonitor/archive/master.zip").

	git clone git@github.com:cfalguiere/SimpleServiceStatusMonitor.git

Move into the project directory 

Get the [D3 library](http://d3js.org/) library (currently d3.V3) and extract in d3.v3.

    curl http://d3js.org/d3.v3.zip -o d3.v3.zip
    unzip d3.v3.test.zip -d d3.v3

### setup 


Edit [updateStatusPage.groovy]("updateStatusPage.groovy") to put your own services.

Look up the services map and replace with your own: 

	def services = 
  		[ [ 'server': 'does not exist',  'url': 'http://does not exist' ],
    	[ 'server': 'www.google.com',  'url': 'http://www.google.com' ]]


### run


Open a terminal and run

    groovy updateStatusPage.groovy
    at Sat Jun 08 15:18:54 CEST 2013
	checking [server:does not exist, url:http://does not exist] ...
	checking [server:www.google.com, url:http://www.google.com] ...
	waiting 1 mn ...
 
Every minute, a new HTML page is generated. Here is an exemple [exemple status page]("doc/status-page.html").

### more setups


#### check interval 

By default the script runs forever and check the services every minute. If you want the script to run only once or prefer another check interval, you may change the maxReadingCount and waitIntervalMn values in Edit [updateStatusPage.groovy]("updateStatusPage.groovy") : 

	def maxReadingCount = -1 // -1 stands for forever
	def waitIntervalMn = 1

    

#### change template 

You may edit the template or provide a CSS Stylesheet pour change the look of this page.

You may take care of these lines when changing the template


Head must have the d3 library and the status panel function.

        <script type="text/javascript" src="d3.v3/d3.v3.js"></script>
        <script type="text/javascript" src="d3-status-panel.js"></script>

In body, take care of the following lines

	<p> At <%= date %> </p>
	<div id="svg"> </div>
        <script type="text/javascript"> 
	var dataset = <%= data %>;
	statusPanel("#svg")
        </script>


The page reloads itself every 5 minutes. You may change the 5000 value (en milliseconds) or remove the onload.

	<body onload="JavaScript:timedRefresh(5000);">
   
   
   

## Feedback

Please feel free to give feedback, [make requests for features or report bugs](https://github.com/cfalguiere/SimpleServiceStatusMonitor/issues) and share your contributions (more check functions, CSS stylesheets, …).

   
<a name="implementation-details"/>

## Implementation details


### Main files


<table>
<tr><td>file</td><td>description</td></tr>
<tr><td>d3.v3/d3.v3.js</td><td>the D3 library</td></tr>
<tr><td>d3-status-panel.js</td><td>draw the status panel</td></tr>
<tr><td>template-status-page.html</td><td>the page template</td></tr>
<tr><td>updateStatusPage.groovy</td><td>collect information and generate the page from template</td></tr>
<tr><td>output/status-page.html</td><td>generated HTML page</td></tr>
</table>

There are roughly 150 lines of code (not including D3 library)

### Build a script


If Groovy is not convenient, you may rewrite the script with another langage and share it.

These are features you will have to deal with:

- run a ping or execute a system command
- fetch a url
- generate a JSON string
- generate a string or a file from a template


The template expects 2 binded data
- date : the date formatted as a String  
- data : a list of maps as a JSON bloc  

Depending on your templating system you may have to change the binding systax as well :

	<p> At <%= date %> </p>
	...
	var dataset = <%= data %>;

This result in

	<p> At Sat Jun 08 13:55:50 CEST 2013 </p>
	…
	var dataset = [{"server":"does not exist","url":"http://does not exist","serverstatus":64,"urlstatus":-1},{"server":"www.google.com","url":"http://www.google.com","serverstatus":0,"urlstatus":0}];



## License


Copyright (C) 2013 

Distributed under the Eclipse Public License
