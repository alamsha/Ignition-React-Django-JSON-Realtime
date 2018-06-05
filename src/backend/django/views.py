# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
import requests
import json
import urllib.parse
from django.http import HttpResponse


# Create your views here.

def get_data():
    # "Gets api data"
    ship_api_url = "http://192.168.1.102/smarttablechart/ignition.php"
    # ship_api_url = "https://api.myjson.com/bins/1ak7li"

    #ship_api_url = "https://app.uhds.oregonstate.edu/api/webcam/ship"
    request_data = requests.get(ship_api_url)
    return request_data.json()

def index(request):
    data = get_data()
    data = json.dumps(data)
    #print (data)
    return HttpResponse(data)



