document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('stepForm');
    const questions = document.querySelectorAll('.question');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    let currentQuestion = 1;
    const totalQuestions = questions.length;
    const backButton = document.getElementById('backButton');

    // Atualiza o progresso
    function updateProgress() {
        const progress = (currentQuestion / totalQuestions) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${currentQuestion} de ${totalQuestions}`;
    }

    // Validações específicas para cada campo
    const validations = {
        nome: {
            regex: /^[A-Za-zÀ-ÿ\s]{3,}$/,
            message: 'Digite um nome válido (mínimo 3 letras)',
            mask: (value) => value.replace(/[^A-Za-zÀ-ÿ\s]/g, '')
        },
        email: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Digite um e-mail válido',
            mask: (value) => value.toLowerCase()
        },
        whatsapp: {
            regex: /^\(\d{2}\)\s\d{5}-\d{4}$/,
            message: 'Digite um WhatsApp válido',
            mask: (value) => {
                value = value.replace(/\D/g, '');
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d)(\d{4})$/, '$1-$2');
                return value;
            }
        },
        'business-name': {
            regex: /^.{3,}$/,
            message: 'Digite um nome válido para seu negócio',
            mask: (value) => value
        }
    };

    // Função para validar input
    function validateInput(input) {
        const validation = validations[input.id];
        const value = input.value.trim();
        const button = input.closest('.question').querySelector('button');
        const errorMessage = input.closest('.input-wrapper').querySelector('.error-message');

        // Remove mensagem de erro existente
        if (errorMessage) errorMessage.remove();

        if (validation) {
            const isValid = validation.regex.test(value);
            button.disabled = !isValid;

            if (!isValid && value !== '') {
                const error = document.createElement('div');
                error.className = 'error-message';
                error.textContent = validation.message;
                input.closest('.input-wrapper').appendChild(error);
            }

            return isValid;
        }

        return value.length > 0;
    }

    // Aplica máscara e validação aos inputs
    questions.forEach(question => {
        const input = question.querySelector('input');
        const button = question.querySelector('button');
        
        if (input && button) {
            input.addEventListener('input', (e) => {
                const validation = validations[input.id];
                if (validation) {
                    const maskedValue = validation.mask(e.target.value);
                    if (maskedValue !== e.target.value) {
                        e.target.value = maskedValue;
                    }
                }
                validateInput(input);
            });

            // Previne envio com Enter se inválido
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (validateInput(input)) {
                        nextQuestion();
                    }
                }
            });
        }
    });

    // Configura as opções selecionáveis
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.disabled = false;
        });
    });

    // Avança para próxima questão
    function nextQuestion() {
        const currentQuestionEl = document.querySelector(`.question[data-question="${currentQuestion}"]`);
        const input = currentQuestionEl.querySelector('input');
        
        if (input && !validateInput(input)) {
            return;
        }

        currentQuestionEl.classList.remove('active');
        currentQuestion++;
        
        const nextQuestionEl = document.querySelector(`.question[data-question="${currentQuestion}"]`);
        nextQuestionEl.classList.add('active');
        
        updateProgress();

        // Foca no próximo input
        const nextInput = nextQuestionEl.querySelector('input');
        if (nextInput) {
            nextInput.focus();
        }
    }

    // Event listeners para os botões
    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', nextQuestion);
    });

    // Submissão do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading"></div>';
        submitBtn.disabled = true;

        try {
            // Coleta todos os dados do formulário
            const formData = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                whatsapp: document.getElementById('whatsapp').value,
                businessName: document.getElementById('business-name').value,
                businessType: document.querySelector('.option.selected').dataset.value
            };

            // Simula envio do formulário
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Cria o resumo
            const summaryContent = document.querySelector('.summary-content');
            summaryContent.innerHTML = `
                <div class="summary-item">
                    <span class="summary-label">Nome:</span>
                    <span class="summary-value">${formData.nome}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">E-mail:</span>
                    <span class="summary-value">${formData.email}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">WhatsApp:</span>
                    <span class="summary-value">${formData.whatsapp}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Negócio:</span>
                    <span class="summary-value">${formData.businessName}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Tipo:</span>
                    <span class="summary-value">${formData.businessType}</span>
                </div>
            `;

            // Cria a mensagem para o WhatsApp
            const whatsappMessage = encodeURIComponent(
                `Olá! Vi seu site e gostaria de solicitar uma prévia.\n\n` +
                `Meus dados:\n` +
                `Nome: ${formData.nome}\n` +
                `E-mail: ${formData.email}\n` +
                `WhatsApp: ${formData.whatsapp}\n` +
                `Nome do Negócio: ${formData.businessName}\n` +
                `Tipo de Negócio: ${formData.businessType}`
            );

            // Atualiza o link do WhatsApp
            const whatsappButton = document.querySelector('.whatsapp-button');
            whatsappButton.href = `https://wa.me/5567981237055?text=${whatsappMessage}`;

            // Mostra tela de sucesso
            form.style.display = 'none';
            document.querySelector('.success-screen').style.display = 'block';

        } catch (error) {
            alert('Erro ao enviar o formulário. Por favor, tente novamente.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Função para mostrar/esconder o botão de voltar
    function updateBackButton(currentStep) {
        if (currentStep === 1) {
            backButton.style.display = 'flex';
        } else {
            backButton.style.display = 'none';
        }
    }

    // Atualizar a função showStep existente
    function showStep(step) {
        steps.forEach(s => s.classList.remove('active'));
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
        updateProgress();
        updateBackButton(step);
    }

    // Inicialização
    updateProgress();
    updateBackButton(1);
}); 