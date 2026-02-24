
import Image from 'next/image';

export default function HomePage() {
  return (
    <section className="text-center py-16">
      <h1 className="text-5xl font-extrabold text-red-600 mb-4">Welcome to Openworld</h1>
      <p className="text-xl text-gray-300 mb-8">A modern web platform designed to showcase innovative features and connect users to the project's vision.</p>
      
      <div className="text-left mb-12">
        <h2 id="about" className="text-4xl font-bold text-red-500 mb-6">About Us</h2>
        <p className="text-lg text-gray-300 mb-4">Openworld is being created because every serious project needs a clear online presence. We aim to help users, partners, or clients quickly understand what the project does, build credibility and trust, and provide a simple entry point for communication and engagement.</p>
        <p className="text-lg text-gray-300">Our platform serves as a central hub that introduces the project, highlights its key features, explains its goals, and makes it easy for visitors to learn more and get in touch. It's a foundation for future development and marketing efforts.</p>
      </div>

      <div className="text-left mb-12">
        <h2 id="features" className="text-4xl font-bold text-red-500 mb-6">Key Features</h2>
        <ul className="list-disc list-inside text-lg text-gray-300 marker:text-red-500 space-y-2">
          <li>Showcasing innovative features with a clean and responsive design.</li>
          <li>Providing easy access to project information and vision.</li>
          <li>Seamless, user-friendly experience.</li>
          <li>Serving as a professional landing page for collaboration and contribution.</li>
          <li>Central hub for project introduction, goals, and contact.</li>
        </ul>
      </div>

      <div className="text-left">
        <h2 id="contact" className="text-4xl font-bold text-red-500 mb-6">Get in Touch</h2>
        <p className="text-lg text-gray-300 mb-4">We're excited about Openworld and welcome your inquiries, contributions, and collaborations.</p>
        <p className="text-lg text-gray-300">Please use the form on our contact page to get in touch, or reach out via your preferred communication channel.</p>
        {/* In a real app, you'd have a contact form here */} 
        <div className="mt-6 p-6 bg-gray-800 rounded-lg max-w-lg mx-auto shadow-lg text-center border-2 border-red-600">
          <p className="text-xl font-semibold">Contact Information Placeholder</p>
          <p className="text-gray-400 mt-2">Email: info@openworldproject.com</p>
          <p className="text-gray-400">Website: https://openworldproject.com (placeholder)</p>
          <p className="text-gray-400 mt-2">GitHub: <a href="https://github.com/abdullhalhemery-bit/Openworld" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">abdullhalhemery-bit/Openworld</a></p>
        </div>
      </div>
    </section>
  );
}
