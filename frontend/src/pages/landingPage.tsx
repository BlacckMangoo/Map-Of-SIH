import { Link } from 'react-router';
import '../index.css';
import handPointingImg from '../assets/LandingPageAssets/handPointingAtUser.png';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-ctp-base text-ctp-text flex flex-col items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                <div className="flex flex-col md:flex-row items-center justify-center gap-10 mb-16 pt-8">
                    <div className="md:w-2/5">
                        <img 
                            src={handPointingImg} 
                            alt="Hand pointing at you" 
                            className="max-w-full w-auto h-auto md:max-h-80 mx-auto md:mx-0"
                        />
                    </div>
                    
                    <div className="md:w-3/5">
                        <div className="p-2 relative">
                            <h2 className="text-3xl font-bold text-ctp-peach mb-5">
                                BRO
                            </h2>
                            <p className="text-2xl text-ctp-text font-bold mb-5">
                                You still using that <span className="line-through text-ctp-red">Shitty</span> SIH website to browse through problem statements?
                            </p>
                            <p className="text-xl text-ctp-sky font-medium">
                                Use the <span className="text-ctp-green font-bold">power of visualization</span> and use <span className="text-ctp-sapphire font-bold text-2xl">SIH MAP!</span>
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="text-center mt-10">
                    <Link to="/app" 
                        className="inline-flex items-center justify-center rounded-lg px-10 py-5 text-2xl font-bold transition-all
                            bg-ctp-sapphire hover:bg-ctp-blue text-ctp-base shadow-md hover:shadow-xl hover:-translate-y-1 duration-300
                            border-b-4 border-ctp-blue">
                        Click to Launch
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 ml-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
                
                <div className="mt-16 pt-6 text-ctp-subtext0 text-sm text-center">
                    <p>Made with <span className="text-ctp-pink">♥</span> using Catppuccin Mocha • {new Date().getFullYear()}</p>
                </div>
            </div>
        </div>
    );
}
