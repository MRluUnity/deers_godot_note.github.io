window.deer = {
    el: "#deer-app",
    data: {
    },
    directives : {
        "d-text": (el, value) => {
            el.innerHTML = value;
        },
        "d-show": (el, value) => {
            el.style.display = value? "block" : "none";
        }
    },
    init(){
        this.root = document.querySelector(this.el);
        this.proxyData = this.observe(this.data);
        this.refreshDom();
        this.registerEvents();
    },
    observe(data) {
        self = this;
        let handler = {
            set: function(target, key, value) {
                target[key] = value;
                self.refreshDom();
            }
        }
        return new Proxy(data, handler);
    },    
    refreshDom() {
        this.walkDom(this.root, el => {
            Array.from(el.attributes).forEach(attribute => {
                if (! Object.keys(this.directives).includes(attribute.name)) return;
               
                with (this.proxyData) {
                    this.directives[attribute.name](el, eval(attribute.value));
                }
            })
        })
    },    
    registerEvents() {
        this.walkDom(this.root, el => {
            Array.from(el.attributes).forEach(attribute => {
                if (! attribute.name.startsWith("ed-")) return;
                let event = attribute.name.replace("ed-", "");
                let deer_expression = attribute.value;
    
                with (this.proxyData) {
                    el.addEventListener(event.toString(), () => {
                        eval(deer_expression);
                    });
                }
            })
        })
    },    
    walkDom(el, callback) {
        callback(el);

        el = el.firstElementChild;

        while (el) {
            this.walkDom(el, callback);
            el = el.nextElementSibling;
        }
    }
}