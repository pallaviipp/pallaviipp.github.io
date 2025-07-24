import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot, 
    doc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove,
    increment,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInAnonymously, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    // --- Global Elements ---
    const body = document.body;
    const menuToggle = document.getElementById('menuToggle');
    const slideMenu = document.getElementById('slideMenu');
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

    // --- Data ---
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
            title: "I Wandered Through the Light",
            images: [
                { 
                    src: "assets/sky1.png", 
                    caption: "Does the sky remember me?" 
                },
                { 
                    src: "assets/sky2.png", 
                    caption: "Clouds like brushstrokes" 
                },
                { 
                    src: "assets/sky3.png", 
                    caption: "Horizon dreams" 
                },
                { 
                    src: "assets/sky4.png", 
                    caption: "Golden hour whispers" 
                }
            ]
        },
        {
            id: 1,
            title: "The City Is So Full of Ghosts",
            images: [
                { 
                    src: "assets/place3.png", 
                    caption: "Nowhere feels like home" 
                },
                { 
                    src: "assets/place1.png", 
                    caption: "Neon reflections" 
                },
                { 
                    src: "assets/place2.png", 
                    caption: "Concrete poetry" 
                },
                { 
                    src: "assets/place4.png", 
                    caption: "Lonely streetlights" 
                }
            ]
        },
        {
            id: 2,
            title: "Is this home?",
            images: [
                { 
                    src: "assets/people4.png", 
                    caption: "Hugs and loves" 
                },
                { 
                    src: "assets/peole1.png", 
                    caption: "Shared silence" 
                },
                { 
                    src: "assets/people2.png", 
                    caption: "Unposed moments" 
                },
                { 
                    src: "assets/people3.png", 
                    caption: "Fleeting togetherness" 
                }
            ]
        },
        {
            id: 3,
            title: "Ode to a Hungry Soul",
            images: [
                { 
                    src: "assets/chiya1.png", 
                    caption: "Tea-stained memories" 
                },
                { 
                    src: "assets/food2.png", 
                    caption: "Comfort in steam" 
                },
                { 
                    src: "assets/food3.png", 
                    caption: "Taste of nostalgia" 
                },
                { 
                    src: "assets/food4.png", 
                    caption: "Bittersweet bites" 
                }
            ]
        }
    ];

    let currentProjectIndex = 0;
    let currentAlbumIndex = 0;

    // --- Initialize Modals ---
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });

    // --- Theme Management ---
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    body.classList.add(savedTheme);

    if (darkModeToggle) {
        darkModeToggle.dataset.theme = savedTheme;
        darkModeToggle.querySelector('.icon').textContent = savedTheme === 'dark-mode' ? '🌙' : '☀️';

        darkModeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                darkModeToggle.querySelector('.icon').textContent = '☀️';
                localStorage.setItem('theme', 'light-mode');
            } else {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                darkModeToggle.querySelector('.icon').textContent = '🌙';
                localStorage.setItem('theme', 'dark-mode');
            }
        });
    }

    // --- Menu Functionality ---
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (slideMenu) {
                slideMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
                body.style.overflow = slideMenu.classList.contains('active') ? 'hidden' : '';
            }
        });
    }

    // --- Scroll to Top ---
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

    // --- CLI Typing Effect ---
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

    // --- Navigation ---
    const navLinks = document.querySelectorAll('.sidebar-nav-link');
    const sections = document.querySelectorAll('main section[id]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50% 0px',
        threshold: 0
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
    document.querySelector('.sidebar-nav-link[href="#overview"]').classList.add('active');

    // --- About Me Swiper ---
    const aboutMeSwiper = new Swiper('.about-me-carousel', {
        loop: false,
        pagination: {
            el: '.about-me-carousel .swiper-pagination',
            clickable: true,
        },
        autoHeight: true,
        allowTouchMove: true,
        on: {
            slideChange: function() {
                // Update active tab when slide changes
                const activeIndex = this.activeIndex;
                const tabButtons = document.querySelectorAll('.tab-button');
                
                tabButtons.forEach((button, index) => {
                    if (index === activeIndex) {
                        button.classList.add('active');
                    } else {
                        button.classList.remove('active');
                    }
                });
            }
        }
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            aboutMeSwiper.slideTo(index);
        });
    });

    // --- Projects Swiper ---
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

    // --- Project Modal Functions ---
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

    document.querySelectorAll('.view-project-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const projectCard = e.target.closest('.project-card');
            if (projectCard) {
                const projectId = parseInt(projectCard.dataset.projectId);
                openProjectModal(projectId);
            }
        });
    });

    // --- Album Modal Functions ---
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
            
            album.images.forEach(image => {
                const polaroid = document.createElement('div');
                polaroid.classList.add('polaroid-container');
                
                polaroid.innerHTML = `
                    <div class="polaroid">
                        <img src="${image.src}" alt="${image.caption}" class="polaroid-image">
                        <div class="polaroid-caption">${image.caption}</div>
                    </div>
                `;
                
                albumGallery.appendChild(polaroid);
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

    // --- Writings Section ---
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

    // --- Modal Close Handlers ---
    document.querySelectorAll('.modal .close-button').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const modal = this.closest('.modal');
            modal.style.display = 'none';
            body.style.overflow = '';
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.style.display = 'none';
                body.style.overflow = '';
            }
        });
    });

    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    const firebaseConfig = {
        apiKey: "AIzaSyAqZN4wnF_34d4n7-zoj_Md2u4yerWVAqc",
        authDomain: "wordscreams.firebaseapp.com",
        projectId: "wordscreams",
        storageBucket: "wordscreams.firebasestorage.app",
        messagingSenderId: "187530605741",
        appId: "1:187530605741:web:a0fa4656ae76f0deb10224"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const adminEmail = "pallavipaudel@gmail.com";


    // Character counter logic
    if (screamInput) {
        screamInput.addEventListener('input', () => {
            const length = screamInput.value.length;
            if (charCount) charCount.textContent = `${length}/280`;
            if (screamBtn) screamBtn.disabled = length === 0 || length > 280;
        });
    }

    // Handle user authentication state
    auth.onAuthStateChanged((user) => {
        if (!user) {
            auth.signInAnonymously().catch((error) => {
                console.error("Anonymous sign-in failed:", error);
            });
        }
        renderScreams(); // Re-render to update like buttons for the current user
    });

    // Post a scream
    async function postScream() {
        if (!screamInput || !screamBtn) {
            console.error("UI elements for screaming are not found!");
            return;
        }
    
        const text = screamInput.value.trim();
        if (!text) {
            alert("Scream can't be empty!");
            return;
        }
    
        screamBtn.disabled = true;
        screamBtn.textContent = 'Authenticating...';
    
        try {
            let user = auth.currentUser;
    
            // Trigger sign-in popup if user is not the admin
            if (!user || user.email !== adminEmail) {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                user = result.user;
            }
    
            // After auth, explicitly check if the user is the admin
            if (user.email !== adminEmail) {
                alert("Sorry, you are not allowed to scream (at me), mail me at pallavipaudel@gmail.com ;)");
                return;
            }
    
            screamBtn.textContent = 'Posting...';
    
            // Timestamp
            const dataToPost = {
                text: text,
                timestamp: Timestamp.fromDate(new Date()), // Best practice for timestamps
                likes: 0,
                likedBy: [],
                userId: user.uid,
                userName: user.displayName || 'Admin'
            };
    
            const screamsCollectionRef = collection(db, "screams");
            await addDoc(screamsCollectionRef, dataToPost);
    
            // Reset input on success
            screamInput.value = '';
            if (charCount) {
                charCount.textContent = '0/280';
            }
    
        } catch (error) {
            console.error("Failed to post scream:", error); 
    
            if (error.code === 'auth/popup-blocked') {
                alert("Popup blocked! Please enable popups for this site to sign in.");
            } else if (error.code === 'auth/popup-closed-by-user') {
                console.log("Sign-in was cancelled."); 
            } else {
                alert("An error occurred while posting. Please check the console and try again.");
            }
        } finally {
            screamBtn.disabled = false;
            screamBtn.textContent = 'Scream';
        }
    }
    
    if (screamBtn) {
        screamBtn.addEventListener('click', postScream);
    }

    // Like a scream
     async function likeScream(screamId, likedBy = []) {
        const user = auth.currentUser;
        if (!user) {
            alert("Please sign in to like a post.");
            return;
        }

        //doc(db, 'collectionName', 'documentId')
        const screamRef = doc(db, "screams", screamId);
        const alreadyLiked = likedBy.includes(user.uid);

        try {
            if (alreadyLiked) {
                //  updateDoc with arrayRemove and increment
                await updateDoc(screamRef, {
                    likes: increment(-1),
                    likedBy: arrayRemove(user.uid)
                });
            } else {
                //updateDoc with arrayUnion and increment
                await updateDoc(screamRef, {
                    likes: increment(1),
                    likedBy: arrayUnion(user.uid)
                });
            }
        } catch (error) {
            console.error("Error liking scream:", error);
        }
    }

    // Render all screams
    function renderScreams() {
        if (!screamsFeed) return;
        
        const q = query(collection(db, "screams"), orderBy("timestamp", "desc"));
        
        onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.empty) {
                screamsFeed.innerHTML = '<div class="empty-state"><p>No wordscreams yet. Be the first to share your thoughts!</p></div>';
                return;
            }
    
            screamsFeed.innerHTML = '';
            const currentUser = auth.currentUser;
    
            querySnapshot.forEach((doc) => {
                const scream = { id: doc.id, ...doc.data() };
                const screamItem = document.createElement('div');
                screamItem.classList.add('scream-item');
    
                //handle the timestamp
                let formattedDate = "Just now";
                if (scream.timestamp) {
                    // Convert Firestore Timestamp to JavaScript Date
                    const date = scream.timestamp.toDate ? scream.timestamp.toDate() : new Date(scream.timestamp);
                    formattedDate = date.toLocaleDateString('en-US', {
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit'
                    });
                }
    
                const likedBy = scream.likedBy || [];
                const isLiked = currentUser && likedBy.includes(currentUser.uid);
    
                screamItem.innerHTML = `
                    <div class="scream-content">
                        <p class="scream-text">${scream.text}</p>
                        <div class="scream-meta">
                            <span>${formattedDate}</span>
                        </div>
                    </div>
                    <div class="scream-actions">
                        <button class="like-button ${isLiked ? 'liked' : ''}" data-id="${scream.id}">
                            <i class="fas fa-heart"></i>
                            <span class="like-count">${scream.likes || 0}</span>
                        </button>
                    </div>
                `;
    
                screamsFeed.appendChild(screamItem);
    
                const likeButton = screamItem.querySelector('.like-button');
                likeButton.addEventListener('click', () => {
                    likeScream(scream.id, likedBy);
                });
            });
        }, (error) => {
            console.error("Error loading screams:", error);
            screamsFeed.innerHTML = '<div class="empty-state"><p>Error loading screams. Please refresh.</p></div>';
        });
    }
    // Initial call
    renderScreams();

    //final
    setTimeout(() => {
        document.body.classList.add('user-has-scrolled');
        document.body.style.overflow = '';
        document.body.style.height = '';
    }, 100);
});