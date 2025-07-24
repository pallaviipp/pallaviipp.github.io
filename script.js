// Firebase SDKs functions import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot, 
    updateDoc, 
    doc, 
    getDoc, 
    setDoc,
    arrayUnion,
    arrayRemove
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
    getAuth, 
    signInWithEmailAndPassword,
    signInAnonymously,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded successfully!');

    if (window.location.hash) {
        window.history.replaceState(null, null, ' ');
    }

    // Scroll to top on page load
window.scrollTo({
    top: 0,
    behavior: 'smooth'
});

    /* --- GLOBAL ELEMENTS --- */
    const body = document.body;
    const menuToggle = document.getElementById('menuToggle');
    const slideMenu = document.getElementById('slideMenu');
    const closeMenu = document.getElementById('closeMenu');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const cliIntro = document.getElementById('cli-intro');
    const projectModal = document.getElementById('projectModal');
    const projectModalImage = document.getElementById('projectModalImage');
    const projectModalTitle = document.getElementById('projectModalTitle');
    const projectModalDescription = document.getElementById('projectModalDescription');
    const projectModalTech = document.getElementById('projectModalTech');
    const albumModal = document.getElementById('albumModal');
    const albumModalTitle = document.getElementById('albumModalTitle');
    const albumGallery = document.getElementById('albumGallery');
    const screamInput = document.getElementById('screamInput');
    const screamBtn = document.getElementById('screamBtn');
    const charCount = document.getElementById('charCount');
    const screamsFeed = document.getElementById('screamsFeed');
    const composeScream = document.getElementById('composeScream');
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginButton = document.getElementById('loginButton');

    window.firebase = { 
        app,
        db, 
        auth, 
        collection, 
        addDoc, 
        query, 
        orderBy, 
        onSnapshot, 
        updateDoc, 
        doc, 
        getDoc, 
        setDoc,
        arrayUnion,
        arrayRemove,
        signInWithEmailAndPassword,
        signInAnonymously,
        onAuthStateChanged
    };

    body.style.overflow = '';
    body.style.height = '';


    /* --- DATA --- */
    const projectsData = [
        {
            id: 0,
            title: "Extensive Breast Cancer Assessment Questionnaire based on known risk factors",
            image: "assets/project1.png",
            description: "Developed a scalable platform for breast cancer risk assessment by using Breast Cancer Surveillance Consortium dataset (~1 million params)",
            tech: ["Python", "SQL", "Streamlit", "Pandas"]
        },
        {
            id: 1,
            title: "Greenhouse Monitoring",
            image: "assets/project2.png",
            description: "Designed and implemented AWS based pipeline to collect sensor data from a prototype greenhouse, enabling real-time monitoring and data analysis.",
            tech: ["s3", "DynamoDB", "React"]
        },
        {
            id: 2,
            title: "Analyzing Student's Mental Health",
            image: "assets/project3.png",
            description: "Utilized SQL and Python to analyze student mental health data, providing insights into factors affecting well-being and academic performance.",
            tech: ["Python", "Pandas", "SQL"]
        },
        {
            id: 3,
            title: "RemitCalc",
            image: "assets/project4.png", 
            description: "Full-stack application fetching real-time and historical currency exchange rates from Nepal Rastra Bank API with React frontend and Express backend.",
            tech: ["React", "Express.js", "REST API", "Axios"]
        }
    ];

    const albumsData = [
        {
            id: 0,
            title: "moments",
            images: ["assets/sky1.png", "assets/sky2.png", "assets/sky3.png", "assets/sky4.png"]
        },
        {
            id: 1,
            title: "places",
            images: ["assets/place3.png", "assets/place1.png", "assets/place2.png", "assets/place4.png"]
        },
        {
            id: 2,
            title: "<3",
            images: ["assets/people4.png", "assets/peole1.png", "assets/people2.png", "assets/people3.png"]
        },
        {
            id: 3,
            title: "cafes",
            images: ["assets/chiya1.png", "assets/food2.png"]
        }
    ];

    let screams = JSON.parse(localStorage.getItem('screams') || '[]');
    let currentProjectIndex = 0;
    let currentAlbumIndex = 0;

  /* --- INITIALIZE MODALS --- */
const modals = document.querySelectorAll('.modal');
modals.forEach(modal => {
    modal.style.display = 'none';
});

// Set initial theme state
const savedTheme = localStorage.getItem('theme') || 'dark-mode'; // Default to dark
body.classList.add(savedTheme);

if (darkModeToggle) {
    // Initialize toggle state
    darkModeToggle.dataset.theme = savedTheme;
    darkModeToggle.querySelector('.icon').textContent = savedTheme === 'dark-mode' ? '🌙' : '☀️';
    
    // Toggle functionality
    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            darkModeToggle.querySelector('.icon').textContent = '☀️';
            darkModeToggle.dataset.theme = 'light-mode';
            localStorage.setItem('theme', 'light-mode');
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            darkModeToggle.querySelector('.icon').textContent = '🌙';
            darkModeToggle.dataset.theme = 'dark-mode';
            localStorage.setItem('theme', 'dark-mode');
        }
    });
}
    /* --- MENU FUNCTIONALITY --- */
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        if (slideMenu) {
            slideMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            body.style.overflow = slideMenu.classList.contains('active') ? 'hidden' : '';
        }
    });
}

if (closeMenu) {
    closeMenu.addEventListener('click', () => {
        if (slideMenu) {
            slideMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

    /* --- SCROLL TO TOP --- */
    window.addEventListener('scroll', () => {
        if (scrollToTopBtn) {
            scrollToTopBtn.classList.toggle('show', window.scrollY > 300);
        }
    });
    
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* --- CLI TYPING EFFECT --- */
    if (cliIntro) {
        const introText = [
            ">$ Hi, I'm Pallavi,",
            ">$ I am trying to learn and explore the world of data engineering and analysis",
            ">$ I have been working with Python, SQL, and various data tools.",
            ">$ Status: Online. Ready for exploration."
        ];
        let lineIndex = 0;
        let charIndex = 0;

        function typeWriter() {
            if (lineIndex < introText.length) {
                if (charIndex < introText[lineIndex].length) {
                    if (lineIndex === 0 && charIndex === 0) {
                        cliIntro.innerHTML = '';
                    }
                    cliIntro.innerHTML += introText[lineIndex].charAt(charIndex);
                    charIndex++;
                    setTimeout(typeWriter, 50);
                } else {
                    cliIntro.innerHTML += '<br>';
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(typeWriter, 800);
                }
            }
        }
        setTimeout(typeWriter, 1000);
    }

    /* --- NAVIGATION --- */
    const navLinks = document.querySelectorAll('.sidebar-nav-link');
    const sections = document.querySelectorAll('main section[id]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50% 0px',
        threshold: 0,
        triggerOnce: false 
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

document.querySelectorAll('.sidebar-nav-link, .slide-menu-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            if (slideMenu && slideMenu.classList.contains('active')) {
                slideMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = '';
            }
        });
    });
    // Force Overview to be active on page load
    /* --- ABOUT ME SWIPER --- */
   const aboutMeSwiper = new Swiper('.about-me-carousel', {
        loop: false,
        pagination: {
            el: '.about-me-carousel .swiper-pagination',
            clickable: true,
        },
        autoHeight: true,
        allowTouchMove: true,
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            aboutMeSwiper.slideTo(index);
        });
    });

    /* --- PROJECTS SWIPER --- */
    const projectsSwiper = new Swiper('.projects-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.projects-swiper .swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        },
    });

    /* --- PROJECT MODAL FUNCTIONS --- */
    function openProjectModal(projectId) {
        currentProjectIndex = projectsData.findIndex(p => p.id === projectId);
        updateProjectModalContent(currentProjectIndex);
        projectModal.style.display = 'flex';
        body.style.overflow = 'hidden';
    }

    function updateProjectModalContent(index) {
        const project = projectsData[index];
        if (project) {
            projectModalImage.src = project.image;
            projectModalTitle.textContent = project.title;
            projectModalDescription.textContent = project.description;
            projectModalTech.innerHTML = '';
            project.tech.forEach(tech => {
                const span = document.createElement('span');
                span.textContent = tech;
                projectModalTech.appendChild(span);
            });
        }
    }

document.getElementById('prevProjectBtn').addEventListener('click', () => {
    currentProjectIndex = (currentProjectIndex - 1 + projectsData.length) % projectsData.length;
    updateProjectModalContent(currentProjectIndex);
});

document.getElementById('nextProjectBtn').addEventListener('click', () => {
    currentProjectIndex = (currentProjectIndex + 1) % projectsData.length;
    updateProjectModalContent(currentProjectIndex);
});

    projectsSwiper.on('slideChange', () => {
        currentProjectIndex = projectsSwiper.realIndex;
    });

    document.querySelectorAll('.view-project-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const projectCard = e.target.closest('.project-card');
            if (projectCard) {
                const projectId = parseInt(projectCard.dataset.projectId);
                openProjectModal(projectId);
            }
        });
    });


    /* --- ALBUM MODAL FUNCTIONS --- */
    function openAlbumModal(albumId) {
        currentAlbumIndex = albumsData.findIndex(a => a.id === albumId);
        updateAlbumModalContent(currentAlbumIndex);
        albumModal.style.display = 'flex';
        body.style.overflow = 'hidden';
    }

    function updateAlbumModalContent(index) {
        const album = albumsData[index];
        if (album) {
            albumModalTitle.textContent = album.title;
            albumGallery.innerHTML = '';
            album.images.forEach(imgSrc => {
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = album.title;
                img.classList.add('album-image');
                albumGallery.appendChild(img);
            });
        }
    }

    document.getElementById('prevAlbumBtn').addEventListener('click', () => {
        currentAlbumIndex = (currentAlbumIndex - 1 + albumsData.length) % albumsData.length;
        updateAlbumModalContent(currentAlbumIndex);
    });
    
    document.getElementById('nextAlbumBtn').addEventListener('click', () => {
        currentAlbumIndex = (currentAlbumIndex + 1) % albumsData.length;
        updateAlbumModalContent(currentAlbumIndex);
    });

    document.querySelectorAll('.album-folder').forEach(folder => {
        folder.addEventListener('click', () => {
            const albumId = parseInt(folder.dataset.albumId);
            openAlbumModal(albumId);
        });
    });

    /* --- WRITINGS SECTION --- */
    document.querySelectorAll('.writing-category .category-title').forEach(title => {
        title.addEventListener('click', () => {
            const content = title.nextElementSibling;
            const icon = title.querySelector('.toggle-icon');

            title.classList.toggle('active');
            if (icon) icon.classList.toggle('active');

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.classList.remove('active');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.classList.add('active');
            }
        });
    });

    document.querySelectorAll('.open-writing-modal').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const title = e.currentTarget.dataset.title;
            const bodyContent = e.currentTarget.dataset.body;
            const writingModal = document.getElementById('writingModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');
    
            if (modalTitle) modalTitle.textContent = title;
            if (modalBody) modalBody.innerHTML = bodyContent;
            if (writingModal) {
                writingModal.style.display = 'flex';
                body.style.overflow = 'hidden';
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    body.style.overflow = '';
                }
            });
        }
    });

/* --- WORDSCREAMS --- */
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAqZN4wnF_34d4n7-zoj_Md2u4yerWVAqc",
    authDomain: "wordscreams.firebaseapp.com",
    projectId: "wordscreams",
    storageBucket: "wordscreams.appspot.com",
    messagingSenderId: "187530605741",
    appId: "1:187530605741:web:a0fa4656ae76f0deb10224"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


function checkAuthState() {
    firebase.onAuthStateChanged(firebase.auth, (user) => {
        if (user) {
            // User is signed in
            composeScream.style.display = 'block';
            loginForm.style.display = 'none';
        } else {
            // User is signed out
            composeScream.style.display = 'none';
            loginForm.style.display = 'block';
        }
    });
}

// Login function
if (loginButton) {
    loginButton.addEventListener('click', async () => {
        const email = loginEmail.value;
        const password = loginPassword.value;
        
        try {
            await firebase.signInWithEmailAndPassword(firebase.auth, email, password);
            loginForm.style.display = 'none';
            composeScream.style.display = 'block';
        } catch (error) {
            alert("Login failed: " + error.message);
            console.error(error);
        }
    });
}

// Character counter
function updateCharCount() {
    const length = screamInput ? screamInput.value.length : 0;
    if (charCount) charCount.textContent = `${length}/280`;
    if (screamBtn) screamBtn.disabled = length === 0 || length > 280;
}

if (screamInput) screamInput.addEventListener('input', updateCharCount);

// Post a new scream
async function postScream() {
    const text = screamInput.value.trim();
    if (!text || text.length > 280) return;

    try {
        // First check if user is authenticated
        const user = firebase.auth.currentUser;
        if (!user) {
            // If not authenticated, try to sign in anonymously
            await firebase.signInAnonymously(firebase.auth);
        }

        // Add scream to Firestore
        await firebase.addDoc(firebase.collection(firebase.db, "screams"), {
            text: text,
            timestamp: new Date().toISOString(),
            likes: 0,
            likedBy: [],
            userId: user ? user.uid : 'anonymous'
        });
        
        screamInput.value = '';
        updateCharCount();
    } catch (error) {
        console.error("Error posting scream:", error);
        alert("Failed to post scream. Please try again.");
    }
}

if (screamBtn) screamBtn.addEventListener('click', postScream);

// Like a scream
async function likeScream(screamId, currentLikes, likedBy = []) {
    try {
        // Generate a unique visitor ID
        const visitorId = localStorage.getItem('visitorId') || 
                          Math.random().toString(36).substring(2) + 
                          Date.now().toString(36);
        localStorage.setItem('visitorId', visitorId);

        // Check if already liked
        const alreadyLiked = likedBy.includes(visitorId);
        
        // Update in Firestore
        const screamRef = firebase.doc(firebase.db, "screams", screamId);
        if (alreadyLiked) {
            // Unlike
            await firebase.updateDoc(screamRef, {
                likes: currentLikes - 1,
                likedBy: firebase.arrayRemove(visitorId)
            });
        } else {
            // Like
            await firebase.updateDoc(screamRef, {
                likes: currentLikes + 1,
                likedBy: firebase.arrayUnion(visitorId)
            });
        }
    } catch (error) {
        console.error("Error liking scream:", error);
    }
}

// Render screams from Firestore
function renderScreams() {
    if (!screamsFeed) return;
    
    screamsFeed.innerHTML = '<div class="loading-screams"><p>Loading screams...</p></div>';

    // Query screams ordered by timestamp
    const q = firebase.query(
        firebase.collection(firebase.db, "screams"),
        firebase.orderBy("timestamp", "desc")
    );

    // Real-time listener
    firebase.onSnapshot(q, (querySnapshot) => {
        const screams = [];
        querySnapshot.forEach((doc) => {
            screams.push({
                id: doc.id,
                ...doc.data()
            });
        });

        if (screams.length === 0) {
            screamsFeed.innerHTML = '<div class="empty-state"><p>No screams yet!</p></div>';
            return;
        }

        screamsFeed.innerHTML = '';
        
        screams.forEach(scream => {
            const screamItem = document.createElement('div');
            screamItem.classList.add('scream-item');
            
            // Format date
            const date = new Date(scream.timestamp);
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Check if visitor already liked this scream
            const visitorId = localStorage.getItem('visitorId');
            const isLiked = visitorId && scream.likedBy && scream.likedBy.includes(visitorId);

            screamItem.innerHTML = `
                <div class="scream-content">
                    <p class="scream-text">${scream.text}</p>
                    <div class="scream-meta">
                        <span>${formattedDate}</span>
                    </div>
                </div>
                <div class="scream-actions">
                    <button class="like-button ${isLiked ? 'liked' : ''}" 
                            data-id="${scream.id}" 
                            data-likes="${scream.likes || 0}">
                        <i class="fas fa-heart"></i>
                        <span class="like-count">${scream.likes || 0}</span>
                    </button>
                </div>
            `;
            
            screamsFeed.appendChild(screamItem);
        });

        // Add event listeners to like buttons
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const screamId = button.dataset.id;
                const currentLikes = parseInt(button.dataset.likes);
                const likedBy = scream.likedBy || [];
                likeScream(screamId, currentLikes, likedBy);
            });
        });
    }, (error) => {
        console.error("Error loading screams:", error);
        screamsFeed.innerHTML = '<div class="empty-state"><p>Error loading screams. Please refresh.</p></div>';
    });
}

// Initialize
// Initialize
if (window.firebase) {
    checkAuthState();
    renderScreams();
} else {
    console.error("Firebase not loaded");
    screamsFeed.innerHTML = '<div class="empty-state"><p>Error initializing screams.</p></div>';
}

/* --- MODAL CLOSE HANDLERS --- */
document.querySelectorAll('.modal .close-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const modal = this.closest('.modal');
        modal.style.display = 'none';
        body.style.overflow = '';
    });
});

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            body.style.overflow = '';
        }
    });
});

document.querySelectorAll('.modal-content').forEach(content => {
    content.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

document.querySelector('.sidebar-nav-link[href="#overview"]').classList.add('active');

setTimeout(() => {
    document.body.classList.add('user-has-scrolled');
    document.body.style.overflow = '';
    document.body.style.height = '';
}, 100);
});