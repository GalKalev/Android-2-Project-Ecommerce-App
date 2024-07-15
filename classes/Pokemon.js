export class Pokemon {
    #name;
    #url;
    #img;
    // #imgShiny;
    #gender;
    #level;
    #isShiny;
    #abilities;
    #moves;
    #species;
    #stats;
    #types;
    #price;
    #amount;

    constructor(name,url, img, gender, level,isShiny, abilities, moves, species, stats, types, price, amount) {
        this.#name = name;
        this.#url = url;
        this.#img = img;
        // this.#imgShiny = imgShiny;
        this.#gender = gender;
        this.#level = level;
        this.#isShiny = isShiny;
        this.#abilities = abilities;
        this.#moves = moves;
        this.#species = species;
        this.#stats = stats;
        this.#types = types;
        this.#price = price;
        this.#amount = amount;
    }

    // Getters
    getName() {
        return this.#name;
    }

    getUrl() {
        return this.#url;
    }

    getImg() {
        return this.#img;
    }

    // getImgShiny() {
    //     return this.#imgShiny;
    // }

    getGender(){
        return this.#gender;
    }
    getLevel(){
        return this.#level;
    }
    getIsShiny(){
        return this.#isShiny;
    }


    getAbilities() {
        return this.#abilities;
    }

    getMoves() {
        return this.#moves;
    }

    getSpecies() {
        return this.#species;
    }

    getStats() {
        return this.#stats;
    }

    getTypes() {
        return this.#types;
    }

    getPrice(){
        return this.#price;
    }
    getAmount(){
        return this.#amount;
    }

    // Setters
    setName(name) {
        this.#name = name;
    }

    setUrl(url) {
        this.#url = url;
    }

    setImg(img) {
        this.#img = img;
    }

    // setImgShiny(imgShiny) {
    //     this.#imgShiny = imgShiny;
    // }

    setGender(gender){
        this.#gender = gender;
    }
    setLevel(level){
        this.#level = level;
    }
    setIsShiny(isShiny){
        this.#isShiny = isShiny;
    }

    setAbilities(abilities) {
        this.#abilities = abilities;
    }

    setMoves(moves) {
        this.#moves = moves;
    }

    setSpecies(species) {
        this.#species = species;
    }

    setStats(stats) {
        this.#stats = stats;
    }

    setTypes(types) {
        this.#types = types;
    }

    setPrice(price){
        this.#price = price;
    }
    setAmount(amount){
        this.#amount = amount;
    }

    ViewPokemon() {
        console.log('______________________');
        console.log(`name: ${this.getName()}`)
        console.log(`url: ${this.getUrl()}`)
        console.log(`img;: ${this.getImg()}`)
        console.log(`gender: ${this.getGender()}`)
        console.log(`abilities: ${this.getAbilities()}`)
        console.log(`moves: ${this.getMoves()}`)
        console.log(`species: ${this.getSpecies()}`)
        console.log(`stats: ${JSON.stringify(this.getStats())}`)
        console.log(`types: ${this.getTypes()}`)
        console.log(`price: ${this.getPrice()}`)
        console.log(`amount: ${this.getAmount()}`)
        console.log('______________________');
    }
}
