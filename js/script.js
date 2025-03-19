// Animação ao rolar
document.addEventListener('DOMContentLoaded', () => {
    // Debounce function para otimizar eventos de scroll
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Otimizar detecção de scroll
    const handleScroll = debounce(() => {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = (
                rect.top <= (window.innerHeight * 0.75) &&
                rect.bottom >= 0
            );
            
            if (isVisible) {
                section.classList.add('animate');
            }
        });
    }, 10);

    // Usar Intersection Observer ao invés de scroll event
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // Parar de observar após animar
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    // Observar seções
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll otimizado
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Menu mobile
const menuButton = document.querySelector('.menu-mobile');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
    menuButton.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuButton.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Animação de scroll suave para os links do menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Adicionar classe active ao menu conforme scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        const id = section.getAttribute('id');
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Slider de depoimentos
const slider = document.querySelector('.depoimentos-slider');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
});

// Formulário
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulação de envio
    const submitBtn = e.target.querySelector('.submit-btn');
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('Formulário enviado com sucesso! Entraremos em contato em breve.');
        e.target.reset();
        submitBtn.textContent = 'Enviar';
        submitBtn.disabled = false;
    }, 1500);
});

// Modal handling
const modalTriggers = document.querySelectorAll('.cta-button, .plano-btn');
const modal = document.getElementById('previewModal');
const closeModal = document.querySelector('.close-modal');
const form = document.getElementById('previewForm');
const steps = document.querySelectorAll('.form-step');
const stepIndicators = document.querySelectorAll('.step-indicator');
let currentStep = 1;

// Open modal
modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Handle steps
function showStep(step) {
    steps.forEach(s => s.classList.remove('active'));
    stepIndicators.forEach(si => si.classList.remove('active'));
    
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
    document.querySelector(`.step-indicator[data-step="${step}"]`).classList.add('active');
}

// Next step
document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', () => {
        if (currentStep < 3) {
            currentStep++;
            showStep(currentStep);
        }
    });
});

// Previous step
document.querySelectorAll('.prev-step').forEach(button => {
    button.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = document.querySelector('.submit-preview');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Simulate form submission
    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
        
        // Success message
        const modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h3>Solicitação Enviada!</h3>
                <p>Entraremos em contato em breve para discutir sua prévia.</p>
            </div>
        `;
        
        // Close modal after 3 seconds
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Reset form
            setTimeout(() => {
                form.reset();
                currentStep = 1;
                showStep(1);
                modalContent.innerHTML = form.outerHTML;
            }, 500);
        }, 3000);
        
    } catch (error) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Solicitar Prévia <i class="fas fa-paper-plane"></i>';
        alert('Erro ao enviar o formulário. Por favor, tente novamente.');
    }
});

// Add success message styles
const styles = `
.success-message {
    text-align: center;
    padding: 2rem;
    animation: fadeIn 0.5s ease;
}

.success-message i {
    font-size: 4rem;
    color: var(--accent);
    margin-bottom: 1rem;
}

.success-message h3 {
    margin-bottom: 1rem;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Otimizar carregamento de imagens
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Usar lazy loading nativo
        images.forEach(img => {
            img.loading = 'lazy';
        });
    } else {
        // Fallback para browsers antigos
        // Carregar um script de lazy loading se necessário
    }
});

// Remover event listeners desnecessários quando não estão em uso
function cleanup() {
    // Remover observers e event listeners quando não necessários
    observer.disconnect();
    window.removeEventListener('scroll', handleScroll);
} 