import { Injectable } from '@angular/core';
declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})

export class RazorpayService {

  constructor() { }

  initiatePayment(amount: number, orderId: string) {
    const options = {
      amount: amount * 100,  // amount in smallest currency unit 
      currency: 'INR',
      order_id: orderId,
      key_id: 'rzp_test_F6F7kwhZ6Uzz2j',
      key_secret: 'NGHNODxo6mJkKQVgvQ2EdrxF',
      name: 'SSDN Software Solutions',
      description: 'Payment for Order',
      qr_required: true,
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      prefill: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        contact: '7973736938'
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: () => {
          console.log('Payment cancelled');
          // Handle payment cancellation
        }
      },
      notes: {
        address: 'Your Address'
      },
      handler: (response: any) => {
        console.log('success response', response);
        // Handle payment success
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }
}
