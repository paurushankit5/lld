class DLL1Node{
    public key : string;
    public value : string;
    public next : DLL1Node | null;
    public prev : DLL1Node | null;
    public expiry : number | null;

    constructor(key : string, value : string, expiry : number | null = null){
        this.key = key;
        this.value = value;
        this.next = null;
        this.prev = null;
        this.expiry = expiry
    }
}

/// head = tail

class LRUCache{

    public cache : Map<string, DLL1Node>;
    public capacity :number;
    public head: DLL1Node;
    public tail: DLL1Node;


    constructor(capacity : number){
        this.cache = new Map();
        this.capacity = capacity;
        this.tail = new DLL1Node("tail" , "");
        this.head = new DLL1Node("head" , "");
        this.head.next = this.tail;
        this.tail.prev = this.head;

        
    }

    private addNode (node : DLL1Node) : void{
        //head = prev = node = tail

        const prev : DLL1Node | null = this.tail.prev;
        prev ? prev.next = node : null;
        node.prev = prev;
        node.next = this.tail;
        this.tail.prev = node;
        return;
    }

    private removeNode(node : DLL1Node){
        //head = node = node1 = tail
        const prev : DLL1Node | null = node.prev;
        const next : DLL1Node | null = node.next;
        if(prev) prev.next = next;
        if(next) next.prev = prev;
        return;

    }

    private evictIfCapacityIsBreached () : void{
        if(this.cache.size > this.capacity){
            const lru : DLL1Node | null = this.head.next;
            if(lru) {
                this.removeNode(lru);
                this.cache.delete(lru.key);
            }
        }
    }

    public put(key : string, value : string, ttl : number | null = null) : void{
        const expiry :number| null = ttl ? ttl + Date.now() : null;
        const node = new DLL1Node(key, value, expiry);
        this.addNode(node);
        this.cache.set(key, node);
        this.evictIfCapacityIsBreached();
    }

    get (key : string) : string | null {
       let result : string | null = null;
       if(this.cache.has(key)){
            const node = this.cache.get(key);
            if(node){
                if(node.expiry){
                    if(Date.now() > node.expiry){
                        this.removeNode(node);
                        this.cache.delete(key);
                    }else{
                        this.removeNode(node);
                        this.addNode(node);
                        result = node.value;
                    }
                }
            }
       }
       return result;

    }

}

const  cache = new LRUCache(3);
cache.put("a" , "1" , 1000);
cache.put("b" , "2" , 1000);
cache.put("c" , "3" , 1000);
cache.put("d" , "4" , 1000);
console.log(cache.get("a"));
setTimeout(() => {
    console.log(cache.get("b") || "expired");
}, 100);

