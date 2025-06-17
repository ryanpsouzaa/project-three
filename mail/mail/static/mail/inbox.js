document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //quando form der submit, executara essa funcao
  document.querySelector('#compose-form').addEventListener('submit', () => {
    event.preventDefault();
    const recipient = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;
    console.log(recipient);
    console.log(subject);
    console.log(body);

    create_email(recipient, subject, body);
    load_mailbox('sent');
  })


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Show Content Send
  if(mailbox === 'sent'){
    get_emails_send();
  }
  if(mailbox === 'inbox'){
    get_emails_inbox();
  }
}


function testeForm(event) {
  event.preventDefault();  // Impede recarregamento da página

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  console.log(body);
  console.log(recipients);
}

function create_email(recipients, subject, body) {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject :  subject,
      body : body
    }),
  })
      .then(response => response.json())
      .then(result => {
        console.log(result)
      })
}

function get_emails_send(){
  const ul = document.createElement('ul')
  ul.setAttribute('id', 'emails-view-send')

  let emails_send = fetch('/emails/sent')
      .then(response => response.json())
      .then(emails_send => {
        document.querySelector('#emails-view').innerHTML = ``

        emails_send.forEach(email => {
          const li = document.createElement('li')
          li.innerHTML = `
          <strong>To: ${email.recipients}</strong> ${email.subject}  ${email.timestamp} 
          `;
          ul.appendChild(li)
        })
        document.querySelector('#emails-view').appendChild(ul)
      })
}

function get_emails_inbox(){
  const ul = document.createElement('ul')
  ul.setAttribute('id', 'emails-view-inbox')

  let emails_inbox = fetch('emails/inbox').then(response => response.json())
  .then(emails_inbox => {
    document.querySelector('#emails-view').innerHTML = ``

    emails_inbox.forEach(email => {
      const li = document.createElement('li');
      li.innerHTML = `
      <strong>${email.sender}</strong>   ${email.subject}    ${email.timestamp}
      `;
      ul.appendChild(li);
    })

    document.querySelector('#emails-view').appendChild(ul);
    console.log(emails_inbox)
  })
}