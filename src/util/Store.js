
export default class Store {
    static get token() {
        return this.#getStore("token")
    }

    static set token(val) {
        this.#setStore("token", val)
    }

    static get path() {
        return this.#getStore("path")
    }

    static set path(val) {
        this.#setStore("path", val)
    }


    static get menus() {
        return this.#getStore("menus")
    }

    static set menus(val) {
        this.#setStore("menus", val)
    }

    static get routePosition() {
        return this.#getStore("routePosition")
    }

    static set routePosition(val) {
        this.#setStore("routePosition", val)
    }

    static removePath() {
        this.#removeStore("path")
    }

    static removeToken() {
        this.#removeStore("token")
    }

    static removeMenus() {
        this.#removeStore("menus")
    }

    static removeRoutePosition() {
        this.#removeStore("routePosition")
    }

    static removeStore() {
        this.removeToken()
        this.removeMenus()
        this.removeRoutePosition()
        this.removePath()
    }

    static #removeStore(key) {
        localStorage.removeItem(key)
    }

    static #setStore(key, value) {
        try {
            value = JSON.stringify(value)
            localStorage.setItem(key, value)
        } catch (e) {
            localStorage.setItem(key, value)
        }

    }

    static #getStore(key) {
        try {
            return JSON.parse(localStorage.getItem(key))
        } catch (e) {
            return localStorage.getItem(key)
        }
    }
}
