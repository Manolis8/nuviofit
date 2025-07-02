
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Users, Target, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";

const AboutPage = () => {
  return (
    <DashboardLayout title="About Us">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-wellness-lavender/30 via-wellness-blue/20 to-wellness-teal/20 rounded-2xl p-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl max-w-3xl mx-auto">
            How a passion for wellness and technology came together to create LifeSpark AI
          </p>
        </div>
      </section>

      {/* Our Beginning */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="relative">
              <div className="absolute -z-10 top-0 left-0 w-full h-full bg-wellness-teal/10 rounded-2xl transform rotate-3"></div>
              <div className="absolute -z-10 top-0 left-0 w-full h-full bg-wellness-blue/10 rounded-2xl transform -rotate-2"></div>
              <img 
                src="https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Peaceful lake scene representing our beginning" 
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center bg-wellness-blue/10 rounded-full px-4 py-2 mb-4">
              <Lightbulb className="text-wellness-blue mr-2 h-5 w-5" />
              <span className="text-sm font-medium">Our Beginning</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">A Vision for Personalized Wellness</h2>
            <p className="text-lg text-gray-700 mb-4">
              LifeSpark AI began in 2023 when our founder, after struggling with inconsistent fitness advice, 
              envisioned a platform that could provide truly personalized wellness guidance.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              With backgrounds in both health sciences and artificial intelligence, our founding team set out to 
              create a system that could analyze individual health data and deliver customized wellness recommendations.
            </p>
            <p className="text-lg text-gray-700">
              What started as a simple mood-tracking app has evolved into a comprehensive wellness platform 
              that integrates with wearable technology to provide holistic health guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-wellness-lavender/10 rounded-full px-4 py-2 mb-4">
            <Target className="text-wellness-lavender mr-2 h-5 w-5" />
            <span className="text-sm font-medium">Our Mission & Values</span>
          </div>
          <h2 className="text-3xl font-bold">What Drives Us Forward</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-gray-700 mb-6">
                At LifeSpark AI, we're on a mission to democratize access to personalized wellness guidance. 
                We believe everyone deserves health advice tailored to their unique body, lifestyle, and goals.
              </p>
              <p className="text-lg text-gray-700">
                By harnessing the power of artificial intelligence and wearable technology, we aim to empower 
                individuals to make informed decisions about their health and well-being.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Our Core Values</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <span className="text-wellness-teal text-xl mr-2">★</span>
                  <div>
                    <h4 className="font-semibold">Personalization</h4>
                    <p className="text-gray-700">We believe in tailored approaches over one-size-fits-all solutions</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-wellness-blue text-xl mr-2">★</span>
                  <div>
                    <h4 className="font-semibold">Accessibility</h4>
                    <p className="text-gray-700">Wellness guidance should be available to everyone, regardless of background</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-wellness-peach text-xl mr-2">★</span>
                  <div>
                    <h4 className="font-semibold">Empowerment</h4>
                    <p className="text-gray-700">We aim to educate and empower rather than dictate</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-wellness-lavender text-xl mr-2">★</span>
                  <div>
                    <h4 className="font-semibold">Innovation</h4>
                    <p className="text-gray-700">We continuously evolve our technology to improve user outcomes</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-wellness-mint/10 rounded-full px-4 py-2 mb-4">
            <Users className="text-wellness-mint mr-2 h-5 w-5" />
            <span className="text-sm font-medium">Our Team</span>
          </div>
          <h2 className="text-3xl font-bold">The Minds Behind LifeSpark AI</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="h-48 bg-wellness-gradient-bg"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold">Sarah Johnson</h3>
              <p className="text-wellness-blue mb-2">Founder & CEO</p>
              <p className="text-gray-600 mb-4">
                With a background in health sciences and AI, Sarah leads our vision for personalized wellness technology.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="h-48 bg-wellness-gradient-bg"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold">Michael Chen</h3>
              <p className="text-wellness-teal mb-2">CTO</p>
              <p className="text-gray-600 mb-4">
                Michael oversees our AI development, ensuring our algorithms deliver truly personalized recommendations.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="h-48 bg-wellness-gradient-bg"></div>
            <div className="p-6">
              <h3 className="text-xl font-bold">Dr. Priya Patel</h3>
              <p className="text-wellness-lavender mb-2">Chief Health Officer</p>
              <p className="text-gray-600 mb-4">
                With over 15 years in wellness coaching, Dr. Patel ensures our recommendations are based on sound health science.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-wellness-teal to-wellness-blue rounded-2xl p-10 text-center text-white">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Heart className="mr-2 h-5 w-5" />
            <span className="text-sm font-medium">Join Our Community</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Be Part of the Wellness Revolution</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience personalized wellness guidance powered by cutting-edge AI and connect your smartwatch for even more tailored recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-wellness-blue hover:bg-white/90">
              <Link to="/dashboard">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white hover:bg-white/10">
              <a href="#" target="_blank" rel="noopener noreferrer">
                Follow Our Journey
              </a>
            </Button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default AboutPage;
