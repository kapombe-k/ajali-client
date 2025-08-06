import { useState } from "react";

export default function EmergencyContactForm() {
  const [formData, setFormData] = useState({
    user_id: "",
    relation: "",
    contact_name: "",
    phone_number: "",
    email: ""
  });

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [contacts, setContacts] = useState([
    // Sample data - replace with your actual data
    { id: 1, relation: "Mother", contact_name: "Jane Smith", phone_number: "555-123-4567", email: "jane@example.com" },
    { id: 2, relation: "Father", contact_name: "John Smith", phone_number: "555-987-6543", email: "john@example.com" },
    { id: 3, relation: "Spouse", contact_name: "Alex Johnson", phone_number: "555-456-7890", email: "alex@example.com" }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form
    if (!formData.user_id || !formData.contact_name || !formData.phone_number) {
      setError("Please fill in all required fields");
      return;
    }

    // Submit logic here (API call, etc.)
    const newContact = {
      id: contacts.length + 1,
      ...formData
    };

    setContacts([...contacts, newContact]);
    setSubmitted(true);
    setError("");
    setFormData({
      user_id: "",
      relation: "",
      contact_name: "",
      phone_number: "",
      email: ""
    });

    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-red-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section - Left Side */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
          <h2 className="text-2xl font-bold text-blue-300 mb-6">Emergency Contact Form</h2>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {submitted && (
            <div className="bg-green-900/50 border border-green-700 text-green-300 p-3 rounded-xl mb-4">
              Contact submitted successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">User ID</label>
              <input
                type="number"
                name="user_id"
                placeholder="Enter your user ID"
                value={formData.user_id}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Relation</label>
              <input
                type="text"
                name="relation"
                placeholder="e.g. Mother, Father, Spouse"
                value={formData.relation}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Contact Name</label>
              <input
                type="text"
                name="contact_name"
                placeholder="Full name"
                value={formData.contact_name}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                placeholder="e.g. 555-123-4567"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email (Optional)</label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors mt-6"
            >
              Submit Contact
            </button>
          </form>
        </div>

        {/* Contacts Panel - Right Side */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
          <h2 className="text-2xl font-bold text-blue-300 mb-6">Your Emergency Contacts</h2>

          {contacts.length === 0 ? (
            <div className="bg-gray-800/50 rounded-xl p-6 text-center border border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-400">No emergency contacts saved yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {contacts.map(contact => (
                <div key={contact.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-blue-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white">{contact.contact_name}</h3>
                    <span className="bg-blue-900/20 text-blue-300 text-xs px-2 py-1 rounded">
                      {contact.relation}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-300 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {contact.phone_number}
                    </p>
                    {contact.email && (
                      <p className="text-sm text-gray-300 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {contact.email}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs bg-blue-900/20 text-blue-300 hover:bg-blue-800/30 px-2 py-1 rounded transition-colors">
                      Edit
                    </button>
                    <button className="text-xs bg-red-900/20 text-red-300 hover:bg-red-800/30 px-2 py-1 rounded transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}