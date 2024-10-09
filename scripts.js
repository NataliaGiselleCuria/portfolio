
document.querySelectorAll('.page a').forEach(link => {
    link.addEventListener('click', function(event) {
        // Obtener el elemento destino
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Obtener el contenedor del thumb
            const scroll = document.querySelector('.scroll');
            const thumb = document.querySelector('.thumb');
            const isMobile = window.matchMedia("(max-width: 600px)").matches;
            const scrollSize = isMobile ? scroll.offsetWidth : scroll.offsetHeight;
            const index = Array.from(this.parentElement.children).indexOf(this);
            const thumbSize = isMobile ? thumb.offsetWidth : thumb.offsetHeight;
            const position = (scrollSize - thumbSize) * index / (this.parentElement.children.length - 1);

            // Mover el thumb
            if (isMobile) {
                thumb.style.left = `${position}px`; // Mover horizontalmente en mobile
            } else {
                thumb.style.top = `${position}px`; // Mover verticalmente en desktop
            }

            // Desplazarse suavemente a la sección
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// IntersectionObserver para seguir el desplazamiento
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
            const isMobile = window.matchMedia("(max-width: 600px)").matches;
            const scrollSize = isMobile ? scroll.offsetWidth : scroll.offsetHeight;
            const index = Array.from(link.parentElement.children).indexOf(link);
            const thumbSize = isMobile ? thumb.offsetWidth : thumb.offsetHeight;
            const position = (scrollSize - thumbSize) * index / (link.parentElement.children.length - 1);

            // Mover el thumb
            if (isMobile) {
                thumb.style.left = `${position}px`; // Mover horizontalmente en mobile
            } else {
                thumb.style.top = `${position}px`; // Mover verticalmente en desktop
            }
        }
    });
}, options);

sections.forEach(section => {
    observer.observe(section);
});

// -- desplazamiento de la web con la barra lateral.

// document.querySelectorAll('.page a').forEach(link => {
//     link.addEventListener('click', function(event) {
        
//         // Obtener el elemento destino
//         const target = document.querySelector(this.getAttribute('href'));
//         if (target) {
//             // Calcular la posición del thumb
//             const scroll = document.querySelector('.scroll');
//             const thumb = document.querySelector('.thumb');
//             const scrollHeight = scroll.offsetHeight;
//             const index = Array.from(this.parentElement.children).indexOf(this);
//             const thumbHeight = thumb.offsetHeight;
//             const position = (scrollHeight - thumbHeight) * index / (this.parentElement.children.length - 1);

//             // Mover el thumb
//             thumb.style.top = `${position}px`;

//             // Desplazarse suavemente a la sección
//             window.scrollTo({
//                 top: target.offsetTop,
//                 behavior: 'smooth'
//             });
//         }
//     });
// });

// const sections = document.querySelectorAll('.content');
// const options = {
//     root: null,
//     rootMargin: '0px',
//     threshold: 0.5
// };

// const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             const id = entry.target.id;
//             const link = document.querySelector(`.page a[href="#${id}"]`);
//             const scroll = document.querySelector('.scroll');
//             const thumb = document.querySelector('.thumb');
//             const scrollHeight = scroll.offsetHeight;
//             const index = Array.from(link.parentElement.children).indexOf(link);
//             const thumbHeight = thumb.offsetHeight;
//             const position = (scrollHeight - thumbHeight) * index / (link.parentElement.children.length - 1);

//             // Mover el thumb
//             thumb.style.top = `${position}px`;
//         }
//     });
// }, options);

// sections.forEach(section => {
//     observer.observe(section);
// });

//carga de proyectos.

document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
        fetch("icons.json").then(response => response.json()),
        fetch("projects.json").then(response => response.json())
    ])
    .then(([icons, projectsData]) => {
        //-- Cargar skills
        const skills = document.querySelector(".skills");
        const skillsul = document.createElement("ul");

        icons.icons.forEach((icon) => {
            if (icon.name === 'GitHub') {
                return '';
            }
            const skill = document.createElement("li");
            skill.innerHTML = `${icon.url}`;
            skillsul.appendChild(skill);
        });

        skills.appendChild(skillsul);

        //-- Carga de proyectos
        const work = document.querySelector(".work");
        const slider = document.querySelector(".slider");

        // Filtrar proyectos
        const personalProjects = projectsData.projects.filter(project => project.type === "project");
        const workProjects = projectsData.projects.filter(project => project.type === "work");

        workProjects.forEach((project, index) => {
            const proj = document.createElement("div");
            proj.classList.add("slide","container", "row");
            proj.id = `work-slide-${index + 1}`;

            // Generar la lista de íconos de tecnologías usando icons.json
            const techIcons = project.technologies.map(tech => {
                
                const icon = icons.icons.find(icon => icon.name === tech);
                return icon ? icon.url : tech;
            }).join(' ');

            proj.innerHTML = `
                <div class="project-description col-xxl">
                    <h5>${project.title}</h5>
                    <p>${project.description}</p>
                    <span class="tecnologies">${techIcons}</span>
                    <span class="links">
                        <a href="${project.liveDemo}" target="_blank">Ver Demo</a>
                        <a href="${project.sourceCode}" target="_blank">GitHub</a>
                        ${project.sourceCode2 ? `<a href="${project.sourceCode2}" target="_blank">Backend</a>` : ''}
                    </span>
                </div>
                <div class="mockups col-xxl">
                    <div class="desktop">
                        <img src="${project.imgDesktop}" alt="Vista de escritorio de ${project.title}">
                    </div>
                </div>
            `;

            work.appendChild(proj);
        });

        // Iterar sobre los proyectos personales
        personalProjects.forEach((project, index) => {
            const slide = document.createElement("div");
            slide.classList.add("slide","container", "row");
            slide.id = `project-slide-${index + 1}`;

            // Generar la lista de íconos de tecnologías 
            const techIcons = project.technologies.map(tech => {
                const icon = icons.icons.find(icon => icon.name === tech);
                return icon ? icon.url : tech;
            }).join(' ');

            slide.innerHTML = `
                <div class="project-description col-xxl">
                    <h5>${project.title}</h5>
                    <p>${project.description}</p>
                    <span class="tecnologies">${techIcons}</span>
                    <span class="links">
                        <a href="${project.liveDemo}" target="_blank">Ver Demo</a>
                        <a href="${project.sourceCode}" target="_blank">GitHub</a>
                        ${project.sourceCode2 ? `<a href="${project.sourceCode2}" target="_blank">Backend</a>` : ''}
                    </span>
                </div>
                <div class="mockups col-xxl">
                    <div class="desktop">
                        <img src="${project.imgDesktop}" alt="Vista de escritorio de ${project.title}">
                    </div>
                </div>
            `;

            slider.appendChild(slide);
        });

        //-- Slider
        let currentSlide = 0;
        const totalSlides = personalProjects.length; // Contar solo los proyectos personales

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





