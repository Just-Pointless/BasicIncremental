String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10)
    var hours   = Math.floor(sec_num / 3600)
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60)
    var seconds = sec_num - (hours * 3600) - (minutes * 60)

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds
}
function ChangeMenu(MenuSelect) {
    var divs = document.getElementById("Menus").getElementsByTagName('div')
    for (var i = 0; i < divs.length; i += 1) {
        if (divs[i].id != MenuSelect) {
            divs[i].style.display = "none"
        } else {
            divs[i].style.display = "block"
        }
    }
}
function setup() {
    //document.getElementById("MainPage").insertAdjacentHTML('beforeend', "test")
    var points = new Decimal(10)
    var playtime = 0
    var tps = 0
    var currenttps = 0
    var genprices = {'Gen1': new Decimal(10)}
    var theme = "white"
    var PUpgrades = {'PUPG_DoublePoints': function(){pointsmulti = Decimal.multiply(pointsmulti,2)}}
    var PUpgradesPrices = {'PUPG_DoublePoints': new Decimal(100)}
    var BoughtPUpgrades = []
    var pointsmulti = new Decimal(1)
    var gen1count = 0
    function calcgain(stattype) {
        if (stattype == "points") {
            return Decimal.multiply(gen1count, pointsmulti)
        }
    }
    setInterval(function(){
        tps += 1
        points = points.add(Decimal.divide(calcgain("points"),30))
        $("#points").html("Points: " + Decimal.round(points) + " (" + Decimal.round(calcgain("points")) + "/s)")
        //$("#pps").html("Points Per Second: " + Decimal.round(pps))
    }, 33.33)
    setInterval(function(){
        playtime += 1
        currenttps = tps
        tps = 0
        $("#playtime").html("You've played for " + String(playtime).toHHMMSS())
        $("#tpscount").html("tps: " + currenttps) 
        if (Decimal.compare(points, 30) >= 0){
            document.getElementById("UpgradesMenu").style.display = "block"
        }
    },1000)
    $("#BuyGen1").click(function(){
        if (Decimal.compare(points, genprices['Gen1']) >= 0){
            points = Decimal.sub(points, genprices['Gen1'])
            genprices['Gen1'] = Decimal.multiply(genprices['Gen1'],1.1)
            gen1count += 1
            $("#BuyGen1").html("Buy a generator (" + Decimal.round(genprices['Gen1']) + " Points)")
        }
    })
    var divs2 = document.getElementById("MenuButtons").getElementsByTagName('button')
    for (var i = 0; i < divs2.length; i += 1) {
        divs2[i].addEventListener('click', function() {
            ChangeMenu(this.id.slice(0,-4))
        })
    }
    $("#ThemeChange").click(function(){
        if (theme == "white"){
            theme = "black"
            document.body.style.backgroundColor = "black"
            textobjects = document.getElementsByTagName('p')
            for (var i = 0; i < textobjects.length; i += 1) {
                textobjects[i].style.color = "white"
            }
            $("#ThemeChange").html("Light")
        } else {
            theme = "white"
            document.body.style.backgroundColor = "white"
            textobjects = document.getElementsByTagName('p')
            for (var i = 0; i < textobjects.length; i += 1) {
                textobjects[i].style.color = "black"
            }
            $("#ThemeChange").html("Dark")
        }
    })
    var upgradebuttons = document.getElementById("Upgrades").getElementsByTagName('button')
    for (var i = 0; i < upgradebuttons.length; i += 1) {
        upgradebuttons[i].addEventListener('click', function() {
            if (Decimal.compare(points, PUpgradesPrices[this.id]) >= 0 && !BoughtPUpgrades.includes(this.id)){
                BoughtPUpgrades.push(this.id)
                PUpgrades[this.id]()
                this.style.backgroundColor = "SlateBlue"
                points = points.sub(PUpgradesPrices[this.id])
            }
        })
    }
}
window.addEventListener('load', function () {
    setup()
    ChangeMenu("Generators")
})