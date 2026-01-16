abstract class RateLimitingStrategy{
    abstract isAllowed(key: string) : boolean;
}

type FixedWindowtype= {
    counter : number,
    windowStartTime: number
}

class FixedWindowStrategy extends RateLimitingStrategy{
    private window : number;
    private maxallowedRequest :  number;
    private data : Map<string, FixedWindowtype>
    constructor(window : number, maxallowedRequest : number){
        super()
        this.data = new Map();
        this.window = window
        this.maxallowedRequest = maxallowedRequest

    }
    isAllowed(key: string) : boolean{
        let isAllowed = false;
        let entry = this.data.get(key)
        if(entry){
            const diff = Date.now() - entry.windowStartTime;
            if(diff > this.window){
                this.data.set(key , {counter: 1, windowStartTime : Date.now()})
                isAllowed = true;
            }else{
                if(entry.counter < this.maxallowedRequest){
                    entry.counter++;
                    this.data.set(key , entry)
                    isAllowed = true;
                }
            }
        }else{
            this.data.set(key , {counter: 1, windowStartTime : Date.now()})
            isAllowed = true;

        }
        return isAllowed;
    }
}

class SlidingWindowStartegy extends RateLimitingStrategy{
    private window : number;
    private maxallowedRequest :  number;
    private data : Map<string, number[]>
    constructor(window : number, maxallowedRequest : number ){
        super();
        this.window = window;
        this.maxallowedRequest = maxallowedRequest;
        this.data = new Map();
    }

    isAllowed(key: string){
        let isAllowed = false;
        let entry = this.data.get(key);
        if(!entry){
            this.data.set(key, [Date.now()]);
            isAllowed = true;
        }else{
            entry = this.clearPreviousEntries(entry);
            console.log(entry.length)
            if(entry.length < this.maxallowedRequest){
                entry.push(Date.now())
                this.data.set(key, entry);
                isAllowed = true;
            }
        }
        return isAllowed;

    }

    protected clearPreviousEntries(entry : number[]){
        const allowedStartTime = Date.now()- this.window;
        let res = []
        for(let i=entry.length-1; i>=0; i--){
            const time = entry[i];
            if(time > allowedStartTime){
                res.push(time);
            }else{
                // console.log("break")
                break;
            }
        }
        return res;
    }
}

type TokenBucketType = {
    token : number,
    lastRefillTime : number
}

class TokenBucketStrategy extends RateLimitingStrategy{
    protected maxCapacity : number;
    protected refillRatePerSec : number;
    protected data : Map<string, TokenBucketType>
    constructor(maxCapacity : number, refillRatePerSec : number){
        super()
        this.data = new Map();
        this.maxCapacity = maxCapacity
        this.refillRatePerSec = refillRatePerSec
    } 

    isAllowed (key: string): boolean{
        this.refillToken(key)
        let isAllowed = false;
        let entry = this.data.get(key)
        if(entry && entry.token > 0){
            isAllowed = true;
            entry.token--;
            this.data.set(key, entry)
        }
        return isAllowed;

    }

    refillToken(key: string){
        const now = Date.now()
        let entry = this.data.get(key)
        if(entry){
            const elapsedTimeinSec = (Date.now()-entry.lastRefillTime)/1000
            if (elapsedTimeinSec <= 0) return;

            entry.token = Math.min(elapsedTimeinSec* this.refillRatePerSec , this.maxCapacity)
            entry.lastRefillTime = now

        }else{
            entry = {token : this.maxCapacity ,lastRefillTime : now }
        }
        this.data.set(key, entry)
    }
}


class RateLimiter{
    private strategy : RateLimitingStrategy;
    constructor(strategy : RateLimitingStrategy){
        this.strategy = strategy
    }

    isAllowed(key : string) : boolean{
        return this.strategy.isAllowed(key);
    }
}

async function run() {
    const obj = new RateLimiter(new TokenBucketStrategy(4, 1));
    console.log(obj.isAllowed("usr1"))
    console.log(obj.isAllowed("usr1"));
    console.log(obj.isAllowed("usr1"))
    console.log(obj.isAllowed("usr1"))
    console.log(obj.isAllowed("usr1"))
    await delay(2000);

    // console.log(obj.isAllowed("usr1"))
    console.log(obj.isAllowed("usr1"))
    console.log(obj.isAllowed("usr1"))
    console.log(obj.isAllowed("usr1"))
    console.log(obj.isAllowed("usr1"))
    console.log(obj.isAllowed("usr1"))
    console.log(obj.isAllowed("usr1"))
}

function delay(ms:number) : Promise<void> {
    return new Promise((resolve) => {
        return setTimeout(() => {
            resolve()
        }, ms);
    })
}

run();