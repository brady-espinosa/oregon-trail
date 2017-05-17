var fs = require('fs')

class Game {
  constructor(id){
    this.partyMembers = [] //array of each partyMember (object)
    this.supplies = {
      oxen: Math.floor(Math.random()*10)+1,
      wagonAxels: Math.floor(Math.random()*5)+1,
      wagonWheels: Math.floor(Math.random()*6)+1,
      wagonTongues: Math.floor(Math.random()*10)+1,
      setsClothing: Math.floor(Math.random()*20)+1,
      bullet: Math.floor(Math.random()*500)+1,
      poundsFood: Math.floor(Math.random()*200)+101
    }
    this.huntStatus = "Fire Away!"
    this.recentlyBroken = ""
    this.recentlyRecovered = ""
    this.recentlyDeceased = ""
    this.recentlyFellIll = ""
    this.brokeDown = false
    this.locations = [
        { name: "Independance Rock",
          source: "https://d1u1p2xjjiahg3.cloudfront.net/89db9648-2aa1-470a-a7ca-b2e2151a1c02.jpg",
          message: "a beautiful rock that marks the outset of your journey. there is a long road ahead"},
        { name: "Death Valley",
          source: "http://assets.fodors.com/destinations/431326/rock-desert-death-valley-national-park-california-usa_main.jpg",
          message: "your party comes across a valley of scorching heat, water is scarce and you are starting to feel like this excursion could be a mistake"},
        { name: "Jailhouse Rock",
          source: "https://images.fineartamerica.com/images-medium-large/1-jailhouse-rock-and-courthouse-rock-edward-peterson.jpg",
          message: "Jailhouse rock marks the end of that terrible valley and, and a good place to recouperate before moving ahead"},
        { name: "Tico's Creek",
          source: "http://kingofwallpapers.com/creek/creek-012.jpg",
          message: "finally a chance to refill water and escape the heat, get your swimming shorts on and lets get wet!"},
        { name: "Singing Plains",
          source: "http://images6.mygola.com/e2b3378537a03da82127e67831f76ce6_1394370901_l.jpg",
          message: "Wind sings as it blows over these beautiful plains. the grassy feilds inspire you to continue on"},
        { name: "Marshes of Madness",
          source: "https://media-curse.cursecdn.com/attachments/36/418/marshes_of_madness.jpg",
          message: "these terrible marshes make your party long for the green hills they left, 'why did we not just settle down there!?'"},
        { name: "Howling Mountain Pass",
          source: "http://wallup.net/wp-content/uploads/2016/01/118883-nature-mountain_pass-mountain.jpg",
          message: "out of the marshes and through this dark mountain pass, at night your party hears the growls of strange animals and want to move quickly"},
        { name: "Rolling Hills",
          source: "http://maynardnambiar.com/development/mockup/wp-content/themes/wordpress-bootstrap-master/library/img/rolling-hills.jpg",
          message: "finally a place to rest.... maybe. the weather and terrain are great, but tales of violent native tribes leave an unsettling feeling"},
        { name: "Fire Swamp",
          source: "https://yourhappyplaceblog.files.wordpress.com/2015/04/princessbride_165pyxurz.jpg",
          message: "a volcanic swamp that filled with agressive vermin, the hardest challenge yet but your destination is no more than a week away!"}
      ] // all the locations in the game
    this.daysSpent = 0;
    this.currentLocation = 0; // index of the locations array
    this.diseases = [
      {name: "cholera", chance: 30},
      {name: "dysentery", chance: 30},
      {name: "broken leg", chance: 80},
      {name: "broken arm", chance: 60},
      {name: "bitten by snake", chance: 100},
      {name: "influenza", chance: 20},
      {name: "spontaneous combustion", chance: 500}
    ]
    if (id === undefined) {
      this.id = Date.now()
    }
    else {
      this.id = id
    }
  }


  hunt(){
    let randomNum = Math.floor(Math.random()*5)
    if (this.supplies.bullet <= 0){
      this.supplies.bullet = 0
      this.huntStatus = "You are Out of Bullets!"
      return 'hunt'
    }
    if (randomNum === 1 && this.supplies.bullet > 0){
      this.supplies.poundsFood+= 20
      this.supplies.bullet-= 30
      this.huntStatus = "Bag'd a big one!"
      return 'hunt'
    }

    else {
      this.supplies.bullet-= 30
      this.supplies.poundFood-= 5
      this.huntStatus = "no luck hunting today "
      return 'hunt'
    }
  }
  save(){
    fs.writeFileSync('game' + this.id + '.json', JSON.stringify(this))
  }
  load(){
    var rawFile = fs.readFileSync('game' + this.id + '.json')
    var tempGame = JSON.parse(rawFile)
    this.partyMembers = tempGame.partyMembers
    this.supplies = tempGame.supplies
    this.locations = tempGame.locations
    this.daysSpent = tempGame.daysSpent
    this.currentLocation = tempGame.currentLocation
    this.brokeDown = tempGame.brokeDown
  }
  checkWagon(){
    let allSupplies = Object.getOwnPropertyNames(this.supplies)
    for (var i = 0; i<4; i++){
      if(this.getBroke(50)){
        let selectedSupply = allSupplies[i]
        this.supplies[selectedSupply] -= 1
        if (this.supplies[selectedSupply] < 0){
          this.brokeDown = true
        }
        this.recentlyBroken = selectedSupply
        return true
      }
    }
    return false
  }
  checkLose(){
    if(this.bodyCount() == 0 || this.supplies.poundsFood <= 0 || this.brokeDown){
      return true
    }
    return false
  }
  bodyCount(){
    let headCount = 0
    this.partyMembers.forEach(function(member){
    if (member.status !== "dead"){
      headCount++
    }
  })
    return headCount
  }
  diseaseRecovery(chance, partyMemberIndex){
    let i = partyMemberIndex
    let randomNum = Math.floor(Math.random() * chance) + 1
    if (randomNum === 1){
      this.partyMembers[i].disease = ""
      this.partyMembers[i].status = "well"
      this.recentlyRecovered = this.partyMembers[i].name
      return true
    }
  }

  die(chance, partyMemberIndex){
    let i = partyMemberIndex
    let randomNum = Math.floor(Math.random() * chance) + 1
    if (randomNum === 1){
      this.partyMembers[i].status = "dead";
      this.recentlyDeceased = this.partyMembers[i].name
      return true
    }
    return false
  }
  getBroke(chance){
    //let i = partyMemberIndex
    let randomNum = Math.floor(Math.random() * chance) + 1
    if (randomNum === 1){
      return true
    }
    return false
  }

  getSick(chance){
    //let i = partyMemberIndex
    let randomNum = Math.floor(Math.random() * chance) + 1
    if (randomNum === 1){
      return true
    }
    return false
  }

  checkSick(){
    for (var i = 0; i < this.partyMembers.length; i++){
      if (this.partyMembers[i].status == "well"){
        for(var j=0; j < this.diseases.length; j++){
            if(this.getSick(this.diseases[j].chance)){
              this.partyMembers[i].status = "sick";
              this.partyMembers[i].disease = this.diseases[j].name;
              this.recentlyFellIll = this.partyMembers[i]
              return true;
            }
          }
      }
    }
    return false;
  }


  checkDead(){
    for (var i = 0; i < this.partyMembers.length; i++){
      if (this.partyMembers[i].status == "sick"){
        switch(this.partyMembers[i].disease){
          case "dysentery":
            if (this.die(3, i)){
              return true
            }
            break;
          case "cholera":
            if (this.die(3, i)){
              return true
            }
            break;
          case "broken leg":
            if (this.die(20, i)){
              return true
            }
            break;
          case "broken arm":
            if (this.die(100, i)){
              return true
            }
            break;
          case "bitten by snake":
            if (this.die(3, i)){
              return true
            }
            break;
          case "influenza":
            if (this.die(50, i)){
              return true
            }
            break;
          case "spontaneous combustion":
            if (this.die(1, i)){
              return true
            }
            break;
          default:
            break;
        }
      }
    }
    return false
  }
  checkRecovered(){
    for (var i = 0; i < this.partyMembers.length; i++){
      if (this.partyMembers[i].status == "sick"){
        switch(this.partyMembers[i].disease){
          case "dysentery":
            if (this.diseaseRecovery(4, i)){
              return true
            }
            break;
          case "cholera":
            if (this.diseaseRecovery(20, i)){
              return true
            }
            break;
          case "broken leg":
            if (this.diseaseRecovery(5, i)){
              return true
            }
            break;
          case "broken arm":
            if (this.diseaseRecovery(3, i)){
              return true
            }
            break;
          case "bitten by snake":
            if (this.diseaseRecovery(10, i)){
              return true
            }
            break;
          case "influenza":
            if (this.diseaseRecovery(3, i)){
              return true
            }
            break;
          default:
            break;
        }
      }
    }
    return false
  }
  takeTurn(){
    if (this.currentLocation === this.locations.length-1 ){
      return "game-won"
    }
    if (this.checkLose()){
      return "lose"
    }
    if (this.checkDead()){
      this.daysSpent += 5;
      this.supplies.poundsFood -= (2 * this.bodyCount()) ;
      if (this.supplies.poundsFood < 0){
        this.supplies.poundsFood = 0
      }
      return "dead"
    }
    if (this.checkRecovered()){
      return "recovered"
    }
    if (this.checkSick()){
      this.daysSpent += 2;
      this.supplies.poundsFood -= (1 * this.bodyCount()) ;
      if (this.supplies.poundsFood < 0){
        this.supplies.poundsFood = 0
      }
      return "sick"
    }
    if(this.checkWagon()){
      return "broke"
    }
    //check if recovered
    //check if sick
    // check if dead

    //check if damage
    //decrement supplies
    //if all false, next location
    this.currentLocation++;
    this.supplies.poundsFood -= (5 * this.bodyCount()) ;
    if (this.supplies.poundsFood < 0){
      this.supplies.poundsFood = 0
    }
    this.daysSpent += 10
    return 'location'
  }
}

module.exports = Game
