// تعريف المتغيرات
let jsonData = {};
let score = 0;
let questionIndex = 0;
let selectedQuestions = [];
let screenshots = [];



// let teamsInformation = {
//     team1:{
//         members:{
//             member1:"youssef",
//             member2:"mohamed",
//             member3:"sameh",
//             member4:"ali"
//         },
//         competitions:{
//             competition1:{
//                 name:"football",
//                 score:5
//             },
//             competition2:{
//                 name:"tennis",
//                 score:5
//             },
//             competition3:{
//                 name:"swimming",
//                 score:5
//             },
//             competition4:{
//                 name:"running",
//                 score:5
//             },
//             competition5:{
//                 name:"chess",
//                 score:5
//             }
//         }
//     },
//     team2:{
//         members:{
//             member1:"youssef",
//             member2:"mohamed",
//             member3:"sameh",
//             member4:"ali"
//         },
//         competitions:{
//             competition1:{
//                 name:"football",
//                 score:5
//             },
//             competition2:{
//                 name:"tennis",
//                 score:5
//             },
//             competition3:{
//                 name:"swimming",
//                 score:5
//             },
//             competition4:{
//                 name:"running",
//                 score:5
//             },
//             competition5:{
//                 name:"chess",
//                 score:5
//             }
//         }
//     },
//     team3:{
//         members:{
//             member1:"youssef",
//             member2:"mohamed",
//             member3:"sameh",
//             member4:"ali"
//         },
//         competitions:{
//             competition1:{
//                 name:"football",
//                 score:5
//             },
//             competition2:{
//                 name:"tennis",
//                 score:5
//             },
//             competition3:{
//                 name:"swimming",
//                 score:5
//             },
//             competition4:{
//                 name:"running",
//                 score:5
//             },
//             competition5:{
//                 name:"chess",
//                 score:5
//             }
//         }
//     },
//     team4:{
//         members:{
//             member1:"youssef",
//             member2:"mohamed",
//             member3:"sameh",
//             member4:"ali"
//         },
//         competitions:{
//             competition1:{
//                 name:"football",
//                 score:5
//             },
//             competition2:{
//                 name:"tennis",
//                 score:5
//             },
//             competition3:{
//                 name:"swimming",
//                 score:5
//             },
//             competition4:{
//                 name:"running",
//                 score:5
//             },
//             competition5:{
//                 name:"chess",
//                 score:5
//             }
//         }
//     },
//     team5:{
//         members:{
//             member1:"youssef",
//             member2:"mohamed",
//             member3:"sameh",
//             member4:"ali"
//         },
//         competitions:{
//             competition1:{
//                 name:"football",
//                 score:5
//             },
//             competition2:{
//                 name:"tennis",
//                 score:5
//             },
//             competition3:{
//                 name:"swimming",
//                 score:5
//             },
//             competition4:{
//                 name:"running",
//                 score:5
//             },
//             competition5:{
//                 name:"chess",
//                 score:5
//             }
//         }
//     },
// }

console.log(teamsInformation['team1']['members'])

// دالة لبدء الكويز
async function startQuiz() {
    const numQuestions = document.getElementById('numQuestions').value;
    const quizContent = document.getElementById('quizContent');
    const quizContainer = document.getElementById('quizContainer');
    const quizActions = document.getElementById('quizActions');

    // إخفاء عناصر الزر عند بدء الاختبار
    quizContent.innerHTML = '';
    quizActions.style.display = 'none';

    try {
        // محاولة تحميل ملف JSON
        const response = await fetch('./js/Question.json');

        // قراءة البيانات وتحويلها إلى JSON
        jsonData = await response.json();
        selectedQuestions = getRandomQuestions(jsonData.questions, numQuestions);
        questionIndex = 0;
        score = 0;
        displayQuestion();
    } catch (error) {
        console.error('Field in load data :', error);
        quizContent.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
    quizContainer.style.animation = "hideContainer 0.5s ease-in-out";
    quizContainer.style.opacity = "0";
    quizContainer.style.zIndex = "-5";
    document.getElementById('particles-js').style.display = "none"
}

// دالة اختيار أسئلة عشوائية
function getRandomQuestions(questions, num) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// دالة لعرض السؤال الحالي
function displayQuestion() {
    const quizContent = document.getElementById('quizContent');

    if (questionIndex >= selectedQuestions.length) {
        showResult();
        return;
    }

    const question = selectedQuestions[questionIndex];

    quizContent.innerHTML = `
        <div>
            <button class="exit-quiz-btn" style="display: flex;" onclick="ExitQuiz()">Exit from Quiz!</button>
            <button class="error-btn" style="display: flex;" onclick="Error()">If there Error Click!</button>
        </div>
        <div class="question-box" style"text-align:center;">
            <h2>${question.topic}</h2>
            <div  style="display: flex; justify-content: space-around;">
            <h3>${document.getElementById('numQuestions').value} / ${questionIndex}</h3>
            <h3>Your Score : ${score}</h3>
            </div>
            <hr>
            <div style="display: flex; justify-content: space-around;">
                <p>${question.question}</p>
            </div>
            <div class="choices">
                ${question.choices.map((choice , index) => 
                    `<button class="choice-btn" style="display: flex;" onclick="checkAnswer('${choice}', '${question.correctAnswer}', this)">
                        <span>${index + 1}</span>
                        <p class="choiceP">${choice}</p>
                    </button>`
                ).join('')}
            </div>
            <div style="display: flex; justify-content: space-around;">
                <button class="explain-btn" title="To explain the question" onclick="showHint('${question.explanation}')">Explain</button>
                <button class="hint-btn" title="To give you a hint" onclick="showHint('${question.help}')">?</button>
            </div>
            <p id="hintMessage" class="hint-text"></p>
        </div>
    `;

}

async function checkAnswer(selected, correct, element) {
    if (selected === correct) {
        element.style.backgroundColor = 'green';
        score++;
    } else {
        element.style.backgroundColor = 'red';
        document.querySelectorAll('.choiceP').forEach(choice => {
            if (choice.innerText === correct) {
                choice.parentElement.style.backgroundColor = "green"; // تغيير لون الإجابة الصحيحة
            }
        });
    }

    // الانتظار حتى يتم عرض التغييرات
    await new Promise(resolve => setTimeout(resolve, 500)); // تأخير 0.5 ثانية

    // التقاط صورة بعد اختيار الإجابة
    const questionBox = document.querySelector('.question-box');

    // تحقق من وجود العنصر قبل التقاط الصورة
    if (questionBox) {
        await html2canvas(questionBox, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            screenshots.push(imgData); // إضافة بيانات الصورة إلى المصفوفة
        });
    } else {
        console.error("Question box not found."); // طباعة رسالة خطأ في حال عدم وجود العنصر
    }

    // الانتظار لمدة ثانيتين قبل الانتقال للسؤال التالي
    setTimeout(() => {
        questionIndex++;
        displayQuestion();
    }, 1000); // 2000 مللي ثانية = ثانيتين
}



// دالة لعرض المساعدة
function showHint(hint) {
    document.getElementById('hintMessage').innerText = hint;
}

// دالة عرض النتيجة النهائية
function showResult() {
    const quizContent = document.getElementById('quizContent');
    const quizActions = document.getElementById('quizActions');

    quizContent.innerHTML = `
        <h2>You finish the Quiz Sucsuffly</h2>
        <p class="finesh">Your score: ${score} / ${selectedQuestions.length}</p>
        <p class="finesh">Good Jop!</p>
 

        <form action="https://api.web3forms.com/submit" class="saveForm" method="POST">
            <input type="hidden" name="access_key" value="46db0722-b0fd-4bba-9641-715c8a7897a6">

            <div class="input-box">
                <input type="text" name="name" placeholder="Full Name" required>
                <input type="email" name="email" placeholder="Email Address" required>
            </div>
            <div class="input-box">
                <input type="number" name="phone" placeholder="Mobile Number" required>
                <input type="number" name="questions" placeholder="question number">
                <input type="number" name="score" placeholder="score">
            </div>
            <input type="submit" class="FormBtn">
        </form>

    `;



    quizActions.style.display = 'flex';

    document.getElementById('particles-js').style.display = "block"
    // إظهار الأزرار بعد الانتهاء

}

async function downloadScreenshotsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);

    // إضافة عنوان
    doc.text("Quiz Questions Screenshots", 10, 10);
    
    let yPosition = 20;

    for (let i = 0; i < screenshots.length; i++) {
        const imgData = screenshots[i];

        // إضافة الصورة إلى PDF
        doc.addImage(imgData, 'PNG', 10, yPosition, 180, 0); // إضافة الصورة
        yPosition += 300; // زيادة الموقع لرسم الصورة التالية

        // تحقق من إذا كانت الصورة تملأ الصفحة
        if (yPosition >= 280) { // إذا وصلت إلى نهاية الصفحة
            doc.addPage(); // إضافة صفحة جديدة
            yPosition = 10; // إعادة تعيين الموضع
        }
    }

    // تحميل الملف PDF
    doc.save('Quiz_Screenshots.pdf');
}


// دالة لبدء اختبار جديد
function startNewQuiz() {
    quizContent.innerHTML = '';
    quizActions.style.display = 'none';

    quizContainer.style.animation = "hideContainer 0.5s ease-in-out";
    quizContainer.style.opacity = "1";
    quizContainer.style.zIndex = "5";
    document.getElementById('particles-js').style.display = "block";
}
function ExitQuiz() {
    alert("(•_•) you are Exit from the Quiz")
    quizContent.innerHTML = '';
    quizActions.style.display = 'none';

    quizContainer.style.animation = "hideContainer 0.5s ease-in-out";
    quizContainer.style.opacity = "1";
    quizContainer.style.zIndex = "5";
    document.getElementById('particles-js').style.display = "block";
}
function Error() {
    score++;
    setTimeout(() => {
        questionIndex++;
        displayQuestion();
    }, 1000); // 2000 مللي ثانية = ثانيتين
}

// دالة لتحديث عرض عدد الأسئلة المختار
function updateQuestionCount(value) {
    document.getElementById('questionCount').innerText = value;
}
