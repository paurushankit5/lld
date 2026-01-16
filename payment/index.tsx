// Design and implement a small payment system for our platform. 
// A customer should be able to pay for an order, select a payment provider.  
// The system should be able to add new providers in the future without changing the core payment logic.

enum PaymentStatus{
    INITIATED,
    PROCESSING,
    SUCCESS,
    FAILED,
    CANCELLED
}

enum Currency{
    INR,
    USD
}

class Payment{
    id: string;
    orderId: string;
    amount: number;
    currency: Currency;
    status: PaymentStatus;
    provider: PaymentProviderType;
    createdAt: Date;
    idempotentKey: string,
    txn_id : string
    

    constructor(){
        
    }


    update(){
        // txn_id
        // status
    }

    getStatus(){
        return this.status;
    }
}


//Payment Method
enum PaymentMethodType  {
    CARD,
    UPI,
    NET_BANKING,
    WALLET
}

interface PaymentMethod {
    type: PaymentMethodType
    validate() : boolean
}


// Payment Provider
interface PaymentProvider{
    initiate(payment : Payment) : string

    verify(providerPaymentId: string): boolean
    handle(): 

}


// Implementation for Provider
class RazorpayProvider implements PaymentProvider{

    async initiate(payment : Payment){
        let id =  `RZR-${Date.now()/1000}`
        return id;
    }

    async verify(providerPaymentId : string){
        //all checks. based on providerPaymentId
        return true;
    }

    async handle(){
        
    }


} 

class StripeProvider implements PaymentProvider{

    async initiate(payment : Payment){
        let id =  `RZR-${Date.now()/1000}`
        return id;
    }

    async verify(providerPaymentId : string){
        //all checks. based on providerPaymentId
        return true;
    }

    async handle(){

    }


} 

class PaymentProviderFactory{
    private enabledProvider : PaymentProvider
    private allproviders : PaymentProvider[]
    constructor(){
        this.allproviders = []
    }
    
    addProvider(provider: PaymentProvider){
        //check if provider is already added
        this.allproviders.push(provider);
    }

    getProvider(): PaymentProvider {
        return this.enabledProvider;
    }

    enableProvider(provider : PaymentProvider){
        //enable one provider form the list

        //check if the provider is already in allproviders list
        this.enabledProvider = provider
      
    }
}


type PaymentRequest = {
    orderId: string,
    amount: number,
    currency: Currency,
    method: PaymentMethod
}

class PaymentRepository{
    public payments : Payment[]
    constructor(){
       this.payments = []
    }

    addPayment(payment : Payment){
        this.payments.push(payment)
    }
}


class PaymentService{
    private providerFactory: PaymentProviderFactory;
    public paymentRepo : PaymentRepository;

    constructor(){
        this.providerFactory = new PaymentProviderFactory();
        this.paymentRepo = new PaymentRepository();
    }

    async createPayment(params : PaymentRequest){
        const provider = this.providerFactory.getProvider()
        // 1. Idempotency check
        // 2. Create Payment Record
        const payment = new Payment(params.orderId, params.amount, params.currency, PaymentStatus.INITIATED)
        this.paymentRepo.addPayment(payment)
        // 3. Call Provider

        const txn_id = provider.initiate(payment);
        // 4. Update Status
        let data = {
            status: PaymentStatus.PROCESSING,
            txn_id: txn_id
        }
        payment.update(data)
        return txn_id
    }

    async handleResponse(payment :Payment, status:PaymentStatus, params ){
        //validate state transitions
        // update status
        // call my client via webhook - case to case basis
    }

    
}

class WebhookHandler{
    async handle(event){
        //verify signature
        // fetch payment by txn_id
        // send it to PaymentService
        PaymentService.handleResponse();
    }
}