import { Link } from 'react-router';
import '../index.css';
import handPointingImg from '../assets/LandingPageAssets/handPointingUser.png';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-ctp-base text-ctp-text flex flex-col items-center justify-center p-6 md:p-12">
            <div className="max-w-5xl w-full">
                {/* Main content section with improved spacing and alignment */}
                <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-16 mb-16 pt-4 md:pt-0">
                    {/* Image column - maintain aspect ratio with proper alignment */}
                    <div className="md:w-2/5 flex justify-center md:justify-end pb-8 md:pb-0">
                        <img 
                            src={handPointingImg} 
                            alt="Hand pointing at you" 
                            className="max-w-full w-auto h-auto md:max-h-96 object-contain"
                        />
                    </div>
                    
                    <div className="md:w-3/5">
                        <div className="p-2 relative space-y-6">
                            {/* Primary heading - largest, most attention-grabbing */}
                            <h1 className="text-4xl font-extrabold text-ctp-peach tracking-tight">
                                Bruh.. <span className="text-ctp-sapphire">Seriously?</span>
                            </h1>
                            
                            {/* Secondary content - slightly smaller, but still important */}
                            <h2 className="text-2xl font-bold text-ctp-text leading-snug">
                                You still using that <span className="line-through text-ctp-red">Shitty</span> SIH website to browse through problem statements?
                            </h2>
                            
                            {/* Supporting text - organized with appropriate spacing */}
                            <div className="space-y-2">
                                <p className="text-xl text-ctp-sky">
                                    Utilise the <span className="text-ctp-green font-bold">power of visualization</span>
                                </p>
                                
                                {/* Call to action - clear emphasis with spacing */}
                                <p className="text-3xl font-bold text-ctp-sapphire pt-1">
                                    SIH MAP!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clear CTA section with proper spacing and alignment */}
                <div className="text-center mt-4 md:mt-12">
                    <Link to="/app" 
                        className="inline-flex items-center justify-center rounded-lg px-10 py-4 text-xl font-bold transition-all
                            bg-ctp-sapphire hover:bg-ctp-blue text-ctp-base shadow-md hover:shadow-xl hover:-translate-y-1 duration-300
                            border-b-4 border-ctp-blue">
                        Click to Launch
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
                
                {/* Simple footer for balance */}
                <div className="mt-16 pt-4 text-ctp-subtext0 text-sm text-center opacity-70">
                    <p>Smart India Hackathon  • {new Date().getFullYear()}</p>
                </div>
            </div>
        </div>
    );
}
