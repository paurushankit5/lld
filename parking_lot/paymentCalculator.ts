export class PaymentCalculator {
    
    // Calculate fee based on hours parked
    // Base rate per hour, minimum 1 hour charge
    calculateFee(entryTime: Date, hourlyRate: number): number {
        const exitTime = new Date();
        const timeDiff = exitTime.getTime() - entryTime.getTime();
        const hoursParked = Math.ceil(timeDiff / (1000 * 60 * 60)); // Convert to hours, round up
        
        // Minimum charge for 1 hour
        const hours = Math.max(1, hoursParked);
        return hours * hourlyRate;
    }
}

