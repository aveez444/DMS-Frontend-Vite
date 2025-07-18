import React, { useState } from "react";
import images from "../../assets/images";

const FAQSection = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      question: "What is this software for?",
      answer: "This software helps manage dealership operations such as inventory, invoices, and customer management.",
    },
    {
      question: "How do I share car details with customers?",
      answer: "You can share car details using our digital catalog feature or by exporting them directly.",
    },
    {
      question: "Can I send invoices?",
      answer: "Yes, invoices can be generated and sent directly from the platform via email or download.",
    },
    {
      question: "Do I need special training to use this?",
      answer: "No, the platform is intuitive and easy to use. We also provide tutorials if needed.",
    },
    {
      question: "How does the price calculator work?",
      answer: "The price calculator allows you to input various parameters to calculate the vehicle’s price quickly.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-24"
      style={{
        backgroundImage: `url(${images.bggradient})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto max-w-screen-md text-center">
        {/* Tagline */}
        <span className="inline-block px-4 py-1 mb-4 text-sm font-bold text-blue-700 bg-blue-100 rounded-full">
          General Questions
        </span>
        {/* Title */}
        <h2 className="text-[32px] font-bold text-gray-900 mb-4">
          Frequently asked questions
        </h2>
        {/* Description */}
        <p className="text-[18px] text-gray-600 mb-12">
          Everything you need to know about DMS. Can’t find the answer you’re looking for? Feel free to{" "}
          <a href="#contact" className="text-blue-500 font-semibold">
            contact us
          </a>
          .
        </p>
        {/* FAQ List */}
        <div className="flex flex-col items-center space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`w-full max-w-[852px] bg-white rounded-lg shadow-md transition-all duration-300 ${
                openQuestion === index ? "min-h-[160px]" : "min-h-[78px]"
              }`}
              onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
            >
              {/* Question Section */}
              <div
                className="flex justify-between items-center px-6 py-4 cursor-pointer hover:shadow-lg transition duration-300"
                style={{ height: "78px" }}
              >
                <span className="text-[18px] text-gray-800 font-medium">{faq.question}</span>
                <span
                  className={`text-blue-500 text-[24px] font-bold transition-transform duration-300 ${
                    openQuestion === index ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </div>

              {/* Answer Section */}
              <div
                className={`px-6 text-[16px] text-gray-600 overflow-hidden transition-all duration-300 ${
                  openQuestion === index ? "max-h-[100px] py-4" : "max-h-0"
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
