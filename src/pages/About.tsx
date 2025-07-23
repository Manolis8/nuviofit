import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lightbulb, Target, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  return (
    <div className="p-6 md:p-10">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-wellness-lavender/30 via-wellness-blue/20 to-wellness-teal/20 rounded-2xl p-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl max-w-3xl mx-auto">
            How our mission to revolutionize health and mindset gave birth to NuvioFit.
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
            <h2 className="text-3xl font-bold mb-4">More Than Fitness, A Movement</h2>
            <p className="text-lg text-gray-700 mb-4">
              NuvioFit started with a simple frustration: fitness and wellness apps only treat symptoms. None understand people. None guide mind and body together. That’s where our founder saw the opportunity to build something truly meaningful.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              With roots in AI, health science, and behavioral psychology, our team set out to create not just a fitness product — but a daily system for mental clarity, physical strength, and lifelong resilience.
            </p>
            <p className="text-lg text-gray-700">
              What started as AI-based habit coaching is evolving into a comprehensive OS for mental and physical performance.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Why We Exist */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-wellness-lavender/10 rounded-full px-4 py-2 mb-4">
            <Target className="text-wellness-lavender mr-2 h-5 w-5" />
            <span className="text-sm font-medium">Mission & Purpose</span>
          </div>
          <h2 className="text-3xl font-bold">Why We Exist</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-gray-700 mb-6">
                To empower people to master their body and mind through AI-driven, personalized health coaching that adapts to their real life — not just their routine.
              </p>
              <p className="text-lg text-gray-700">
                We help people build consistent habits in fitness, nutrition, mindfulness, and recovery through one unified, intelligent platform.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Why We Built This</h3>
              <p className="text-lg text-gray-700 mb-4">
                Health tech is broken. Apps track steps but don’t guide growth. Programs give routines but don’t understand people. We’re here to fix that.
              </p>
              <p className="text-lg text-gray-700">
                Our platform isn’t just workouts. It’s a system that listens, adapts, motivates, and evolves with you — designed to make discipline, health, and mental toughness achievable for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
<section className="mb-16">
  <div className="text-center mb-10">
    <h2 className="text-3xl font-bold">🔮 Our Vision for the Future</h2>
  </div>
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <p className="text-lg text-gray-700 mb-4">
      At <strong>NuvioFit</strong>, our vision reaches beyond fitness.
      We aim to reshape the future of health and wellness by creating technologies that help people master both body and mind, through systems that adapt, understand, and empower.
    </p>
    <p className="text-lg text-gray-700 mb-4">
      We are not building “just another app.” We are laying the foundation for a <strong>revolutionary ecosystem</strong> that will redefine how people achieve health, resilience, and balance — mentally and physically.
    </p>
    <p className="text-lg text-gray-700 mb-4">
      We envision a world where health technology isn’t just reactive, but predictive. Not generic, but deeply personal. Not focused on trends, but on transforming lives.
    </p>
    <p className="text-lg text-gray-700 mb-4">
      We will <strong>thrive to lead a movement</strong> — a future where people don’t rely on guesswork or motivation alone. Instead, they are equipped with intelligent tools that evolve with them, understand their unique challenges, and guide them to lasting results.
    </p>
    <p className="text-lg text-gray-700 mb-4">
      <strong>Our long-term mission is clear:</strong>
    </p>
    <p className="text-lg text-gray-700 mb-4">
      To build revolutionary products that transform not just individuals, but society’s relationship with health.
      We want our technology to inspire a generation to live with purpose, strength, and mental clarity — to reshape health culture for decades to come.
    </p>
    <p className="text-lg text-gray-700">
      <strong>This is bigger than fitness.</strong> This is about changing how people think, live, and succeed.
      This is how we will write our name in history.
    </p>
  </div>
</section>


      {/* Call to Action */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-wellness-teal to-wellness-blue rounded-2xl p-10 text-center text-white">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Heart className="mr-2 h-5 w-5" />
            <span className="text-sm font-medium">Join Our Mission</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Be Part of the Wellness Revolution</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience the future of personalized health, powered by AI. Build habits. Build resilience. Build the life you want.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-wellness-blue hover:bg-white/90">
              <Link to="/dashboard">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white hover:bg-white/10">
              <a href="/dashboard" target="_blank" rel="noopener noreferrer">
                Follow Our Journey
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
