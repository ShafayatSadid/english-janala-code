// speak your word
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// manage spinner
const manageSpinner = (status) => {
    if (status === true) {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-section').classList.add('hidden');
    }
    else {
        document.getElementById('word-section').classList.remove('hidden');
        document.getElementById('spinner').classList.add('hidden');
    }
}

// sny display function
const displaySyn = (synonyms) => {

    const createBtn = synonyms.map(sny => `<button class="text-[1rem]/[40px] text-[#000000] py-[6px] px-5 bg-[#EDF7FF] border border-[#D7E4EF] rounded-md">${sny} </button>`);

    return createBtn.join(" ");
}

// load lessons
const loadLessons = () => {

    const url = 'https://openapi.programming-hero.com/api/levels/all';
    fetch(url)
        .then(response => response.json())
        .then(lessons => displayLessons(lessons.data));
}

loadLessons()


const displayLessons = (lessons) => {

    // get lessons container and empty
    const lessonsContainer = document.getElementById('lessons-container');
    lessonsContainer.innerHTML = ""
    // get lesson
    lessons.forEach(lesson => {

        // create element
        const lessonBtn = document.createElement('div');
        // add innerHTML
        lessonBtn.innerHTML = `
        <button id="lsn-btn-${lesson.level_no}" onclick="loadWord(${lesson.level_no})" class="lsn-btn btn btn-outline btn-primary text-[0.875rem]/[21px] font-semibold" href=""><i
                    class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
        `


        // append child
        lessonsContainer.appendChild(lessonBtn)
    });


}

// load word function
const loadWord = (id) => {

    // call spinner
    manageSpinner(true)

    // get dynamic url with id
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    // call the active btn function
    activeBtn(id);

    fetch(url)
        .then(response => response.json())
        .then(words => displayWord(words.data));
}

// active btn function
const activeBtn = (id) => {
    const getBtn = document.getElementById(`lsn-btn-${id}`);
    // get all lsn btn
    const allLsnBtn = document.querySelectorAll('.lsn-btn');
    // remove from all active class
    allLsnBtn.forEach(btn => {
        btn.classList.remove('active');
    })

    // main style
    getBtn.classList.add('active')
    // console.log(getBtn)
}

// display word function
const displayWord = (words) => {

    // get parent and empty
    const wordSection = document.getElementById('word-section');
    wordSection.innerHTML = "";

    // if a lesson is empty I will show a card
    if (words.length == 0) {
        // create a empty-card
        // add innerHTML
        // append child

        const emptyCard = document.createElement('div');
        emptyCard.classList.add('col-span-3');

        emptyCard.innerHTML = `
        <div class="text-center py-[54px]">
        <img class ="mx-auto mb-[15px]" src="./assets/alert-error.png" alt="">
                <p class="font-bangla text-[#79716B] text-[1rem]/[24px]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h3 class="text-[2.125rem]/[40px] font-bangla font-medium mt-3 text-[#292524]">নেক্সট Lesson এ যান</h3>
            </div>
        `
        wordSection.appendChild(emptyCard);
        // call spinner
        manageSpinner(false)
        return;
    }

    // word card start
    words.forEach(word => {

        // create element and add innerHTML
        const wordCard = document.createElement('div');
        wordCard.innerHTML = `
        <div class="word-card bg-[#FFFFFF] rounded-xl shadow-sm text-center max-w-[547px] w-full md:h-[300px] p-14">

                <!-- word-card-content -->
                <div class="word-card-content space-y-[24px]">
                    <h3 class="text-[1.8rem]/[24px] font-bold">${word.word ? word.word : "Not Found"} </h3>
                    <p class="text-[1rem]/[24px] font-medium">Meaning /Pronunciation</p>
                    <p class="text-[#18181B] font-bangla text-[1.8rem]/[24px] font-semibold">${word.meaning ? word.meaning : "Not Found"} /${word.pronunciation ? word.pronunciation : "Not Found"}</p>
                </div>

                <div class="word-btns flex justify-between mt-[30px]">
                    <button onclick="loadDetails(${word.id})" class="info-btn py-[8px] px-[12px] text-[1rem] rounded-xl bg-[#1A91FF]/10 hover:bg-[#1A91FF]/50"><i class="fa-solid fa-circle-info"></i></button>

                    <button onclick="pronounceWord('${word.word}')" class="volume-btn py-[8px] px-[12px] text-[1rem] rounded-xl bg-[#1A91FF]/10 hover:bg-[#1A91FF]/50"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `

        // append child
        wordSection.appendChild(wordCard)
        // call spinner
        manageSpinner(false)
    })
}

// search function
const search = () => {

    const inputSearch = document.getElementById('input-search');
    const value = inputSearch.value.trim().toLowerCase();
    console.log(value);

    // all word url
    const url = 'https://openapi.programming-hero.com/api/words/all';
    fetch(url)
        .then(response => response.json())
        .then((words) => {
            const allWords = words.data
            console.log(allWords);
            // filter words
            const filterWords = allWords.filter((word) => word.word.toLowerCase().includes(value));

            displayWord(filterWords);
        })



}

// load details
const loadDetails = async (id) => {

    const url = `https://openapi.programming-hero.com/api/word/${id}`;

    const response = await fetch(url);
    const details = await response.json();
    displayDetail(details.data);

}

const displayDetail = (details) => {

    // get parent
    // add innerHTML
    // append child

    const detailsSection = document.getElementById('details-section');
    detailsSection.innerHTML = "";

    detailsSection.innerHTML = `

                <!-- modal content -->
                <div class="p-6 border border-[#EDF7FF] rounded-xl">

                    <h3 class="text-[2rem] font-semibold mb-8">${details.word} (<i class="fa-solid fa-microphone-lines"></i> : ${details.pronunciation ? details.pronunciation : "Not Found"})</h3>

                    <h4 class="text-[1.25rem] font-semibold">Meaning</h4>
                    <p class="text-[1.25rem] font-medium font-bangla mb-8">${details.meaning ? details.meaning : "Not Found"}</p>

                    <h4 class="text-[1.25rem] font-semibold">Example</h4>
                    <p class="text-[1.25rem] mb-8">${details.sentence ? details.sentence : "Not Found"}</p>

                    <!-- three btn for sme word -->
                    <h3 class="text-[1.25rem] font-medium font-bangla mb-[8px]">${details.synonyms.length === 0 ? "কোন সমার্থক শব্দ পাওয়া যায়নি" : "সমার্থক শব্দ গুলো"}</h3>

                    <div class="flex flex-wrap gap-[14px]">${displaySyn(details.synonyms)} </div>
                </div>

                <div class="modal-action">
                    <form method="dialog">
                        <!-- if there is a button in form, it will close the modal -->
                        <button class="btn btn-primary text-[1rem] font-medium py-2 px-6 text-[#ffffff] rounded-lg">Complete Learning</button>
                    </form>
                </div>
    
    `
    document.getElementById('word_modal').showModal()
}
