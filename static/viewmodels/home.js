function HomeViewModel() {

    var self = this
    self.location = ko.observable()
    self.weather = ko.observable()
    self.currentTemp = ko.observable()
    self.weatherDesc = ko.observableArray()
    self.lat
    self.lon
    
    self.findLocation = function() {
        //TODO: actually update the weather based on the city they search for
        $.getJSON ( "http://nominatim.openstreetmap.org/search", {
                q: self.location(),
                format: "json"
            })
            .done(function(data) {
                //TODO: might get back more than 1 city possibbly, allow them to choose
                self.weather(data)
            })
    }
    
    
    self.setLocation = function(geoPos) {
        self.lat = geoPos.coords.latitude
        self.lon = geoPos.coords.longitude
        
        $.getJSON("http://nominatim.openstreetmap.org/reverse", {
            format: "json",
            lat: self.lat,
            lon: self.lon,
            zoom: 10,
            addressdetails: 1
        })
        .done(function(addressData) {
            self.location(addressData.address.city + ", " + addressData.address.state)
            self.getWeather(addressData.address.city + "," + addressData.address.state)
        })
    }

    self.getWeather = function(addressText) {
        $.getJSON("http://api.openweathermap.org/data/2.5/weather", {
            mode: "json",
            units: "metric",
            q: addressText
        })
        .done(function(weatherData) {
            console.log(weatherData)
            self.currentTemp(weatherData.main.temp + "°C")
            self.weatherDesc(weatherData.weather)
        })
    }

    navigator.geolocation.getCurrentPosition(self.setLocation)
    
}

ko.applyBindings(new HomeViewModel())