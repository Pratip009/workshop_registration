import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    workshop: '',
  });
  const [paymentLink, setPaymentLink] = useState({ url: '', text: '' });
  const [paymentClicked, setPaymentClicked] = useState(false); // track payment click

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'workshop') {
      if (value === 'phone_repair') {
        setPaymentLink({
          url: 'https://buy.stripe.com/3cIcN6aLS0dggO076S6wE0K',
          text: 'Pay for Phone Repair Workshop',
        });
        setPaymentClicked(false);
      } else if (value === 'beauty_101') {
        setPaymentLink({
          url: 'https://buy.stripe.com/8x29AUdY4e4655i2QC6wE0L',
          text: 'Pay for Beauty 101 Workshop',
        });
        setPaymentClicked(false);
      } else {
        setPaymentLink({ url: '', text: '' });
        setPaymentClicked(false);
      }
    }
  };

  const handleSubmit = (e) => {
    if (!formData.workshop) {
      e.preventDefault();
      alert('Please select a workshop.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Workshop Registration</h2>
        <form
          id="registrationForm"
          action="https://formsubmit.co/your-email@example.com"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="workshop" className="block text-sm font-medium text-gray-700">
              Workshop Interested In
            </label>
            <select
              id="workshop"
              name="workshop"
              value={formData.workshop}
              onChange={handleInputChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a workshop</option>
              <option value="phone_repair">Phone Repair</option>
              <option value="beauty_101">Beauty 101</option>
            </select>
          </div>
          {paymentLink.url && (
            <div className="mb-4">
              <p className="text-sm text-gray-700">Please complete the payment via Stripe to proceed:</p>
              <a
                href={paymentLink.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setPaymentClicked(true)} // mark payment link clicked
                className="text-blue-600 font-semibold hover:underline"
              >
                {paymentLink.text}
              </a>
            </div>
          )}
          {paymentClicked && (
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
