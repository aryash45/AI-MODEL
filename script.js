// Use const for elements that won't be reassigned
const btn = document.querySelector("#btn");
const content = document.querySelector("#content");
const voice = document.querySelector("#voice");

function speak(text){
    try {
        const text_speak = new SpeechSynthesisUtterance(text);
        text_speak.rate = 1;
        text_speak.pitch = 1;
        text_speak.volume = 1;
        text_speak.lang = "en-US";
        
        // Add error handling
        text_speak.onerror = (event) => {
            console.error('Speech synthesis error:', event);
        };
        
        window.speechSynthesis.speak(text_speak);
    } catch (error) {
        console.error('Speech synthesis failed:', error);
    }
}

function wishMe(){
    let day=new Date()
    let hours=day.getHours()
    if(hours>=0 && hours<12){
        speak("Good Morning Sir")
    }
    else if(hours>=12 && hours <16){
        speak("Good afternoon Sir")
    }else{
        speak("Good Evening Sir")
    }
}
// window.addEventListener('load',()=>{
//     wishMe()
// })
let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!speechRecognition) {
    alert("Speech recognition is not supported in this browser");
    btn.style.display = "none";
}
let recognition = new speechRecognition();
recognition.onresult=(event)=>{
    let currentIndex=event.resultIndex
    let transcript=event.results[currentIndex][0].transcript
    content.innerText=transcript
   takeCommand(transcript.toLowerCase())
}

// Debounce the recognition start to prevent multiple rapid clicks
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

btn.addEventListener("click", debounce(() => {
    recognition.start();
    voice.style.display = "block";
    btn.style.display = "none";
}, 300));

function takeCommand(message){
    voice.style.display = "none";
    btn.style.display = "flex";

    // Define commands in an object for better maintainability
    const commands = {
        "hello": () => speak("Hello, I'm Max. How can I assist you today?"),
        "hey": () => speak("Hello, I'm Max. How can I assist you today?"),
        "who are you": () => speak("I am Max, your virtual assistant"),
        "open youtube": () => {
            speak("opening youtube...");
            window.open("https://youtube.com/", "_blank");
        },
        "open google": () => {
            speak("opening google...");
            window.open("https://google.com/", "_blank");
        },
        "open github": () => {
            speak("opening github...");
            window.open("https://github.com/", "_blank");
        },
        "open gmail": () => {
            speak("opening gmail...");
            window.open("https://mail.google.com/", "_blank");
        },
        "what's the weather": () => {
            speak("opening weather information...");
            window.open("https://weather.com/", "_blank");
        },
        "play music": () => {
            speak("opening spotify...");
            window.open("https://open.spotify.com/", "_blank");
        },
        "tell me a joke": () => {
            const jokes = [
                "Why don't programmers like nature? It has too many bugs!",
                "What do you call a bear with no teeth? A gummy bear!",
                "Why did the scarecrow win an award? Because he was outstanding in his field!"
            ];
            speak(jokes[Math.floor(Math.random() * jokes.length)]);
        },
        "what day is it": () => {
            const date = new Date().toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            speak(date);
        }
    };

    // Check for exact matches first
    for (const [cmd, action] of Object.entries(commands)) {
        if (message.includes(cmd)) {
            action();
            return;
        }
    }

    // Handle time and date separately as they need dynamic responses
    if (message.includes("time")) {
        const time = new Date().toLocaleString(undefined, {
            hour: "numeric",
            minute: "numeric"
        });
        speak(time);
        return;
    }

    // Default fallback
    const finalText = "Here's what I found on the internet regarding " + message;
    speak(finalText);
    window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
}

// Wrap particles initialization in window load event
window.addEventListener('load', function() {
    particlesJS("particles-js", {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ffffff"
            },
            shape: {
                type: "triangle"
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "repulse"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
});

// Add this to handle cleanup when the user navigates away
window.addEventListener('beforeunload', () => {
    if (recognition) {
        recognition.abort();
    }
    window.speechSynthesis.cancel();
});