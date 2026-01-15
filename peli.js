let noppamaara = 1
let pelaajamaara = 0
let pelaajavuoro = 0
let pisteet = 0
let tuplat = 0
let goal = 100
const pelaajat = []

function constructlist() {
    let list = document.getElementById("plist")
    list.innerHTML = ""
    for (let i = 0; i < pelaajamaara; i++){
        let pelaaja = document.createElement("li")
        pelaaja.setAttribute("class", "pelaaja")
        let pelaajatxt = ""
        if (pelaajavuoro == i) {
            pelaajatxt += "*" + pelaajat[i].nimi + " : " + pelaajat[i].score + "*"
        }
        else {
            pelaajatxt += pelaajat[i].nimi + " : " + pelaajat[i].score
        }
        let pelaajainfo = document.createTextNode(pelaajatxt)
        pelaaja.appendChild(pelaajainfo)
        list.appendChild(pelaaja)
    }
}

function dice() {
    let min = Math.ceil(1)
    let max = Math.floor(6)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function victory() {
    document.getElementById("bigtxt").innerHTML = `${pelaajat[pelaajavuoro].nimi} voitti!`
    let nappicontainer = document.getElementById("napit")
    nappicontainer.innerHTML = ""

    let retry = document.createElement("button")
    let retrytxt = document.createTextNode("Uusi peli?")
    retry.appendChild(retrytxt)
    retry.setAttribute("class", "nappi")
    retry.addEventListener("click", function joo() {
        location.reload()
    })
    document.getElementById("napit").appendChild(retry)
}

function ohi() {
    pelaajat[pelaajavuoro].score += pisteet
    pisteet = 0
    document.getElementById("bigtxt").innerHTML = pisteet
    constructlist()

    if (pelaajat[pelaajavuoro].score >= goal) {
        victory()
        return
    }

    pelaajavuoro += 1
    if (pelaajavuoro == pelaajamaara) {
        pelaajavuoro = 0
    }
}

function roll() {
    if (noppamaara == 1) {
        let number = dice()
        let png = document.getElementById("dice1")
        png.setAttribute("src", `assets/noppa${number}.png`)
        if (number > 1) {
            pisteet += number
            document.getElementById("bigtxt").innerHTML = pisteet
        }
        else {
            pisteet = 0
            document.getElementById("bigtxt").innerHTML = pisteet
            ohi()
        }
    }

    else {
        let number1 = dice()
        let png1 = document.getElementById("dice1")
        png1.setAttribute("src", `assets/noppa${number1}.png`)

        let number2 = dice()
        let png2 = document.getElementById("dice2")
        png2.setAttribute("src", `assets/noppa${number2}.png`)

        if (number1 == number2 && number1 == 1) {
            pisteet += 25
            tuplat += 1
        }
        else if (number1 == number2) {
            pisteet += (number1 + number2) * 2
            tuplat += 1
        }
        else if (number1 == 1 || number2 == 1) {
            pisteet = 0
            tuplat = 0
            ohi()
        }
        else {
            pisteet += number1 + number2
            tuplat = 0
        }

        document.getElementById("bigtxt").innerHTML = pisteet
        document.getElementById("tuplat").innerHTML = `Tuplat : ${tuplat}`

        if (tuplat >= 3) {
            pisteet = 0
            tuplat = 0
            ohi()
        }
    }
}


function gamestart() {
    document.getElementById("bigtxt").innerHTML = "0"
    document.getElementById("submit").remove()

    let cont = document.getElementById("container")
    let napit = document.getElementById("napit")
    napit.innerHTML = ""
    let dicecontainer = document.createElement("div")
    dicecontainer.setAttribute("id", "dice")
    cont.insertBefore(dicecontainer, napit)

    for (let i = 1; i <= noppamaara; i++) {
        let initialdice = document.createElement("img")
        initialdice.setAttribute("src", "assets/noppa1.png")
        initialdice.setAttribute("class", "dicepng")
        initialdice.setAttribute("id", `dice${i}`)
        dicecontainer.appendChild(initialdice)
    }

    constructlist()

    let rollbutton = document.createElement("button")
    rollbutton.setAttribute("class", "nappi")
    let rolltext = document.createTextNode("Heitä noppaa")
    rollbutton.appendChild(rolltext)
    rollbutton.addEventListener("click", roll)
    napit.appendChild(rollbutton)

    let passbutton = document.createElement("button")
    passbutton.setAttribute("class", "nappi")
    let passtext = document.createTextNode("Lopeta vuoro")
    passbutton.appendChild(passtext)
    passbutton.addEventListener("click", ohi)
    napit.appendChild(passbutton)

    let scoregoal = document.createElement("p")
    scoregoal.setAttribute("id", "targettxt")
    scoregoal.setAttribute("class", "gameinfo")
    let scoregoaltxt = document.createTextNode(`Tavoite : ${goal}`)
    scoregoal.appendChild(scoregoaltxt)
    document.body.insertBefore(scoregoal, document.getElementById("plist"))

    if (noppamaara > 1) {
        let tupla = document.createElement("p")
        tupla.setAttribute("id", "tuplat")
        tupla.setAttribute("class", "gameinfo")
        let tuplatxt = document.createTextNode("Tuplat : 0")
        tupla.appendChild(tuplatxt)
        document.body.insertBefore(tupla, document.getElementById("plist"))
    }
}

function luenimet(event) {
    event.preventDefault()
    for (let i = 1; i <= pelaajamaara; i++) {
        let nimi = document.getElementById(`lomake${i}`).value
        pelaajat.push({nimi : nimi, score: 0})
    }
    gamestart()
}

function nimet() {
    document.getElementById("bigtxt").innerHTML = "Nimeä pelaajat"
    
    let nappisetti = document.getElementById("napit")
    nappisetti.innerHTML = ""
    let container = document.getElementById("container")

    for (let i = 1; i <= pelaajamaara; i++) {
        let lomakenimi = document.createElement("input")
        lomakenimi.setAttribute("type", "text")
        lomakenimi.setAttribute("placeholder", `Pelaajan ${i} nimi`)
        lomakenimi.setAttribute("id", `lomake${i}`)
        nappisetti.appendChild(lomakenimi)
    }

    let submit = document.createElement("button")
    submit.setAttribute("id", "submit")
    submit.setAttribute("class", "nappi")
    let submittxt = document.createTextNode("Anna")
    submit.appendChild(submittxt)
    container.appendChild(submit)
    submit.addEventListener("click", luenimet)
}

function playercount() {
    let goalinput = document.getElementById("goalinput")
    if (goalinput.value < 10 || isNaN(goalinput.value) || goalinput.value > 1000) {
        return
    }
    goal = goalinput.value
    document.getElementById("bigtxt").innerHTML = "Monta pelaajaa?"
    let nappisetti = document.getElementById("napit")
    nappisetti.innerHTML = ""
    goalinput.remove()

    for (let i = 2; i <= 5; i++) {
        let elementid = "p" + i
        let button = document.createElement("button")
        button.setAttribute("id", elementid)
        button.setAttribute("class", "nappi")
        let elementtxt = document.createTextNode(`${i} pelaajaa`)
        button.appendChild(elementtxt)

        button.addEventListener("click", function (event) {
            event.preventDefault()
            pelaajamaara = i
            nimet()
        })
        nappisetti.appendChild(button)
    }
}

function kaksnoppaa(event) {
    event.preventDefault()
    noppamaara = 2
    playercount()
}

function yksnoppa(event) {
    event.preventDefault()
    playercount()
}

document.getElementById("noppa1").addEventListener("click", yksnoppa)
document.getElementById("noppa2").addEventListener("click", kaksnoppaa)