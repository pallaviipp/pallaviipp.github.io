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

    /* --- DATA --- */
    const projectsData = [
        {
            id: 0,
            title: "Real-time Log Analysis Platform",
            image: "assets/project1.jpg",
            description: "Developed a scalable platform for real-time ingestion, processing, and analysis of application logs using Kafka, Spark Streaming, and Elasticsearch.",
            tech: ["Kafka", "Spark", "Elasticsearch", "Grafana"]
        },
        {
            id: 1,
            title: "E-commerce Data Warehouse & BI",
            image: "assets/project2.jpg",
            description: "Designed and implemented a star-schema data warehouse for an e-commerce platform, enabling comprehensive sales and customer behavior analytics.",
            tech: ["Snowflake", "dbt", "Tableau", "SQL"]
        },
        {
            id: 2,
            title: "IoT Sensor Data Processing",
            image: "assets/project3.jpg",
            description: "Engineered a robust system for collecting, cleaning, and aggregating data from IoT sensors, supporting real-time anomaly detection and predictive maintenance.",
            tech: ["AWS IoT Core", "Kinesis", "Lambda", "DynamoDB"]
        }
    ];

    const albumsData = [
        {
            id: 0,
            title: "moments",
            images: ["assets/album1.jpg", "assets/nature1.jpg", "assets/nature2.jpg"]
        },
        {
            id: 1,
            title: "places",
            images: ["assets/album2.jpg", "assets/urban1.jpg", "assets/urban2.jpg"]
        },
        {
            id: 2,
            title: "<3",
            images: ["assets/album3.jpg", "assets/culture1.jpg", "assets/culture2.jpg"]
        },
        {
            id: 3,
            title: "nom nom",
            images: ["assets/album4.jpg", "assets/food1.jpg", "assets/food2.jpg"]
        }
    ];

    let screams = JSON.parse(localStorage.getItem('screams') || '[]');
    let currentProjectIndex = 0;
    let currentAlbumIndex = 0;

    /* --- INITIALIZE MODALS --- */
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    }); // Add this closing brace to fix the error


    if (darkModeToggle) {
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
            "Hi, I'm Pallavi Paudel.",
            ">$ Initializing Data Engineer Portfolio...",
            ">$ Loading modules: [Spark, Snowflake, Python, AWS]",
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

// The misplaced modal-related code block has been removed.

/* --- WORDSCREAMS --- */
function updateCharCount() {
    const length = screamInput ? screamInput.value.length : 0;
    if (charCount) charCount.textContent = `${length}/280`;
    if (screamBtn) screamBtn.disabled = length === 0 || length > 280;
}

function postScream() {
    const text = screamInput.value.trim();
    if (text && text.length <= 280) {
        screams.unshift({
            id: Date.now(),
            text: text,
            timestamp: new Date().toLocaleString(),
            likes: 0
        });
        localStorage.setItem('screams', JSON.stringify(screams));
        renderScreams();
        screamInput.value = '';
        updateCharCount();
    }
}

function renderScreams() {
    if (!screamsFeed) return;
    screamsFeed.innerHTML = '';
    
    if (screams.length === 0) {
        screamsFeed.innerHTML = '<div class="empty-state"><p>No wordscreams yet!</p></div>';
        return;
    }
    
    screams.forEach(scream => {
        const screamItem = document.createElement('div');
        screamItem.classList.add('scream-item');
        screamItem.innerHTML = `
            <div class="scream-content">
                <p>${scream.text}</p>
                <span class="scream-meta">${scream.timestamp}</span>
            </div>
            <div class="scream-actions">
                <button class="like-button" data-id="${scream.id}">
                    <i class="fas fa-heart"></i> ${scream.likes}
                </button>
            </div>
        `;
        screamsFeed.appendChild(screamItem);
    });
}

if (screamInput) screamInput.addEventListener('input', updateCharCount);
if (screamBtn) screamBtn.addEventListener('click', postScream);
updateCharCount();
renderScreams();

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

// Closing brace for DOMContentLoaded event listener
});