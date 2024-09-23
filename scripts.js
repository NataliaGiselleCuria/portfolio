// -- desplazamiento de la web con la barra lateral.

document.querySelectorAll('.page a').forEach(link => {
    link.addEventListener('click', function(event) {
    
        // Obtener el elemento destino
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Calcular la posición del thumb
            const scroll = document.querySelector('.scroll');
            const thumb = document.querySelector('.thumb');
            const scrollHeight = scroll.offsetHeight;
            const index = Array.from(this.parentElement.children).indexOf(this);
            const thumbHeight = thumb.offsetHeight;
            const position = (scrollHeight - thumbHeight) * index / (this.parentElement.children.length - 1);

            // Mover el thumb
            thumb.style.top = `${position}px`;

            // Desplazarse suavemente a la sección
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

const sections = document.querySelectorAll('.content');
const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            const link = document.querySelector(`.page a[href="#${id}"]`);
            const scroll = document.querySelector('.scroll');
            const thumb = document.querySelector('.thumb');
            const scrollHeight = scroll.offsetHeight;
            const index = Array.from(link.parentElement.children).indexOf(link);
            const thumbHeight = thumb.offsetHeight;
            const position = (scrollHeight - thumbHeight) * index / (link.parentElement.children.length - 1);

            // Mover el thumb
            thumb.style.top = `${position}px`;
        }
    });
}, options);

sections.forEach(section => {
    observer.observe(section);
});

//--carga de proyectos

document.addEventListener("DOMContentLoaded", function() {
    Promise.all([
        fetch("icons.json").then(response => response.json()),
        fetch("projects.json").then(response => response.json())
    ])
    .then(([icons, projectsData]) => {
        const slider = document.querySelector(".slider");
        slider.style.display = 'flex';  // Asegurarse de que el slider funcione con flexbox
        
        // Iterar sobre los proyectos y generar las diapositivas
        projectsData.projects.forEach((project, index) => {
            const slide = document.createElement("div");
            slide.classList.add("slide");
            slide.id = `slide-${index + 1}`;
    
            // Generar la lista de íconos de tecnologías usando icons.json
            const techIcons = project.technologies.map(tech => {
                const icon = icons.icons.find(icon => icon.name === tech);
                return icon ? `<img src="${icon.url}" alt="${tech}" title="${tech}">` : tech;
            }).join(' '); // Asegurarse de que los íconos se muestren correctamente
    
            slide.innerHTML = `
                <div class="project-description">
                    <h5>${project.title}</h5>
                    <p>${project.description}</p>
                    <span class="tecnologies">${techIcons}</span>
                    <span class="links">
                    <a href="${project.liveDemo}" target="_blank">Ver Demo</a>
                    <a href="${project.sourceCode}" target="_blank">Código Fuente</a>
                    ${project.sourceCode2 ? `<a href="${project.sourceCode2}" target="_blank">Backend</a>` : ''}
                    </span>
                </div>
                <div class="mockups">
                    <div class="desktop">
                        <img src="${project.imgDesktop}" alt="Vista de escritorio de ${project.title}">
                        <div class="mobile ${project.imgMobile.includes('landscape') ? 'landscape' : ''}">
                            <img src="${project.imgMobile}" alt="Vista móvil de ${project.title}">
                        </div>
                    </div>
                </div>
            `;
    
            slider.appendChild(slide);
        });

            //--Slider
            let currentSlide = 0; 
            const totalSlides = document.querySelectorAll('.slide').length; 

            function moveSlide(step) {
                currentSlide += step;

                if (currentSlide < 0) {
                    currentSlide = totalSlides - 1; 
                } else if (currentSlide >= totalSlides) {
                    currentSlide = 0; 
                }

                const slideWidth = document.querySelector('.slide').clientWidth;

                // Cambiar la posición del slider
                slider.style.transform = `translateX(-${slideWidth * currentSlide}px)`;
            }

            document.querySelector('.prev').addEventListener('click', () => moveSlide(-1));
            document.querySelector('.next').addEventListener('click', () => moveSlide(1));
        })
        .catch(error => console.error('Error loading projects:', error));
});

