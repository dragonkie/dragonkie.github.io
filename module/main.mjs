console.log('Initialize web page...');

// list of projects to add to the portfolio
const projects = [
    {
        id: 'newedo',
        name: 'NewEdo',
        count: 5
    }, {
        id: 'myriad',
        name: 'Tales from Myriad',
        count: 5
    }, {
        id: 'asta',
        name: '\xC1sta',
        count: 5,
        description: "This is my dungeons & dragons character \xC1sta, she is very precious and is responsible for a one shot kill on the final boss of our campaign! She's a white dragonborn and halfling mix, dad really shouldnt have fucked that shortstack."
    }, {
        id: 'vacation',
        name: 'Vacation',
        count: 5
    }, {
        id: 'pets',
        name: 'Pets',
        count: 5
    }, {
        id: 'npc',
        name: 'I used to be an Adventurer',
        count: 5
    }
];

/*------------------------------------------*/
/* Creates a list of slide elements         */
/*------------------------------------------*/
for (const project of projects) {
    // Create the slide container and add it to the list
    project.slides = [];

    for (let a = 0; a < project.count; a++) {
        const slide = document.createElement('div');
        const img = document.createElement('img');
        const cap = document.createElement('div');
        const num = document.createElement('div');

        slide.className = 'slide';
        cap.className = 'caption';
        num.className = 'slide-counter';
        img.src = `./assets/gallery/${project.id}-${a}.jpg`

        slide.appendChild(img);
        slide.appendChild(cap);
        slide.appendChild(num);

        slide.addEventListener('transitionend', () => {
            console.log('remove animating class from sldie');
            slide.classList.remove('animate');
        })

        project.slides.push(slide);

        // Prepare project details box
        project.details = document.createElement('div');
        project.details.className = 'details';

        // Add title
        let title = document.createElement('div');
        title.className = 'title';
        title.appendChild(document.createTextNode(project.name));
        // Add titles border bar on bottom
        project.details.appendChild(title);

        // Add description text
        let description = document.createElement('div');
        description.className = 'description';
        description.appendChild(document.createTextNode(project.description));
        project.details.appendChild(description);
    }
    console.log(project);
}

window.onload = () => {
    const colours = ['#00ADB5', '#393E46', '#18185c']
    const portfolio = document.querySelector('#portfolio');
    const library = portfolio.querySelector('.library');
    const modal = document.querySelector('.modal');
    const content = modal.querySelector('.content');
    const carousel = content.querySelector('#carousel');
    const controls = carousel.querySelector('.controls');

    // Close modal when clicking out of its space
    modal.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            modal.classList.toggle('closing');
        }
    }

    modal.querySelector('.close').onclick = () => {
        modal.classList.add('closing');
    }

    // Remvoe modal from page after its finished disapearing
    modal.addEventListener('animationend', () => {
        if (modal.classList.contains('closing')) {
            modal.classList.remove('active');
            modal.classList.remove('closing');

            // Remove all active slides
            let slides = modal.querySelectorAll('.slide');
            for (s of slides) s.remove();
            // Remove the details element
            modal.querySelector('.details').remove();
        }
    });

    /*--------------------------------------------------*/
    /* Controls carousel swapping left and right        */
    /*--------------------------------------------------*/
    controls.onclick = (event) => {
        // Gets the control we clicked on
        if (controls.classList.contains('disabled')) return;
        // Double checks a valid control node is present
        let control = event.target.closest('.control');
        if (!control) return;
        // Checks if the control is for the right or left side
        let dir = control.classList.contains('right') ? 'right' : 'left';

        // Disables the controls to prevent spam clicking breaking the sequence
        controls.classList.add('disabled');
        setTimeout(() => controls.classList.remove('disabled'), 300);

        // Get the different elements we need to check
        let active = carousel.querySelector('.slide.active');
        let next = active.nextElementSibling;
        let last = active.previousElementSibling;
        if (!next && !last) return;

        // if we get to here, prepare a list of slides
        let slides = carousel.querySelectorAll('.slide');

        // sets the next / last slide to always be valid
        if (last.classList.contains('controls') || !last) last = slides[slides.length - 1];
        if (!next) next = slides[0];

        if (dir == 'left') {
            active.className = 'slide right animate';
            last.className = 'slide active animate';

            let a = last;
            let l = a.previousElementSibling;

            if (!l || l.classList.contains('controls')) l = slides[slides.length - 1];
            l.classList.remove('right');
            l.classList.add('left');
        } else if (dir == 'right') {
            active.className = 'slide left animate';
            next.className = 'slide active animate';

            let a = next;
            let n = a.nextElementSibling;

            if (!n) n = slides[0];
            n.classList.remove('left')
            n.classList.add('right');
        }

        // Ensures we have a new next and last control
        if (last.classList.contains('controls') || !last) last = slides[slides.length - 1];
        if (!next) next = slides[0];
    }

    /*--------------------------------------------------*/
    /* Dynamically populate project gallery             */
    /*--------------------------------------------------*/
    let projectCouter = 0;
    for (const project of projects) {
        let ele = document.createElement('div');
        ele.className += 'project flex';
        ele.style.backgroundColor = colours[projectCouter % 3];

        // set up the opening of modal and adding in of project specific images and texts
        ele.onclick = () => {
            modal.classList.toggle('active');
            let first = true;
            for (const slide of project.slides) {
                slide.className = 'slide';
                carousel.appendChild(slide);
                if (first) {
                    slide.classList.add('active');
                    first = false;
                } else slide.classList.add('right');
            }
            project.slides[project.slides.length - 1].className = 'slide left'
            content.appendChild(project.details);
        };

        projectCouter += 1;

        let tag = document.createElement('div');
        tag.className += 'tag';

        let txt = document.createTextNode(project.name);
        tag.appendChild(txt);
        ele.appendChild(tag);
        library.appendChild(ele);
        project.element = ele;
    }

    const sections = document.querySelector('body').querySelectorAll('section[id]');
    const links = document.querySelector('nav').querySelectorAll('.page-link');

    /*--------------------------------------------------*/
    /* Nav bar page scrolling                           */
    /*--------------------------------------------------*/
    for (const l of links) {
        l.onclick = () => {
            document.querySelector(`#${l.dataset.link}`).scrollIntoView({
                behavior: "smooth"
            })
        }
    }

    /*--------------------------------------------------*/
    /* Nav bar section higlighting                      */
    /*--------------------------------------------------*/
    window.onscroll = (event) => {
        let target = {
            v: Infinity,
            e: sections[0]
        }

        for (const ele of sections) {
            let rect = ele.getBoundingClientRect();
            if (Math.abs(rect.top) < target.v) {
                target.v = Math.abs(rect.top);
                target.e = ele;
            }
        }

        for (const l of links) {
            if (l.dataset.link == target.e.id) l.classList.add('active');
            else l.classList.remove('active');
        }
    }

    /*--------------------------------------------------*/
    /* Webapp interception for contact form             */
    /*--------------------------------------------------*/
    const cForm = document.getElementById("contact-form");
    cForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log('submitting form');

        const data = new FormData(cForm);
        const action = e.target.action;

        // Create notification for submission pop up box
        let notification = document.createElement('div') 
        let content = document.createTextNode('Submitting contact form...');
        notification.className = 'notification new';
        notification.appendChild(content);
        document.body.appendChild(notification);

        // Disables the contact form
        document.getElementById('submit-contact').disabled = true;
        setTimeout(() => {
            document.getElementById('submit-contact').disabled = false;
        }, 2500)

        setTimeout(() => {
            notification.classList.remove('new');
        }, 50);

        // Add dismissal option on click
        notification.onclick = () => {
            notification.parentNode.removeChild(notification);
        }

        // add listener to delete after fading out
        notification.addEventListener('animationend', (e) => {
            if (notification.classList.contains('fade')) {
                notification.parentNode.removeChild(notification);
            }
        })

        // add 2 second delay to notification fade
        setTimeout(() => {
            notification.classList.add('fade');
        }, 2000)

        // set timeout to say message failed to send if it takes to long
        let formTimeout = true
        setTimeout(() => {
            if (formTimeout) {
                console.error('failed to send message')
            }
        }, 10000)

        fetch(action, {
            method: 'POST',
            body: data
        }).then(() => {
            // Create the contact succesful message
            formTimeout = false;
            console.log('Contact succesful')
        })
    })

}

