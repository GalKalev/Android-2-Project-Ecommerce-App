export class Item{
    #name
    #price
    #category
    #image
    #description
    #attributes

    constructor(name, price, category, image, description, attributes){
        this.#name = name;
        this.#price = price;
        this.#category = category;
        this.#image = image;
        this.#description = description;
        this.#attributes = attributes;
    }

    get name(){
        return this.#name
    }
    get price(){
        return this.#price
    }
    get category(){
        return this.#category
    }
    get image(){
        return this.#image
    }
    get description(){
        return this.#description
    }
    get attributes(){
        return this.#attributes
    }

    set name(newName){
        this.#name = newName;
    }
    set price(newprice){
        this.#price = newprice;
    }
    set category(newCategory){
        this.#category = newCategory;
    }
    set image(newImage){
        this.#image = newImage;
    }
    set description(newDescription){
        this.#description = newDescription;
    }
    set attributes(newAttributes){
        this.#attributes = newAttributes;
    }

}