import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RazorpayService } from './services/razorpay.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'razor-pay';
  constructor(private http: HttpClient, private razorpayService: RazorpayService) { }

  ngOnInit(): void {
    this.initiatePayment();
  }

  initiatePayment() {
    const amount = 500; // Amount in your currency (e.g., INR)
    const currency = 'INR';

    // Make POST request to create a test order ID
    this.http.post<any>('http://localhost:3000/create-order', { amount, currency })
      .subscribe(
        (data) => {
          const orderId = data.orderId;
          // Now you have the orderId, initiate payment
          this.razorpayService.initiatePayment(amount, orderId);
        },
        (error) => {
          console.error('Error creating order:', error);
        }
      );
  }
}
