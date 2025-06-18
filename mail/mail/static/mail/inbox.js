document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //codigo feio
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

  // Show Content Inbox/Send/Archive
  get_emails(mailbox);
}

//todo: codigo feio
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

//todo: nao esta funcionando ao clicar no email - email_view
//todo: talvez especificar melhor a message de array vazio
function get_emails(mailbox){
  const heading = document.createElement('h3');
  heading.innetHTML = `Emails ${mailbox}`;

  const ul = document.createElement('ul');
  ul.setAttribute('id', 'emails-view-ul');

  const emails_div = document.querySelector('#emails-view');

  fetch(`emails/${mailbox}`).then(response => response.json())
    .then(emails => {
      
      emails_div.innerHTML = '';
      if(emails.length > 0){
        emails_div.appendChild(heading)

        emails.forEach(email => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${email.sender}</strong>  ${email.subject}  ${email.timestamp}`;
          li.style.cursor = 'pointer';

          li.addEventListener('click', view_email(email.id))

          ul.appendChild(li);
        })
        emails_div.appendChild(ul);

      }else{
        const message = document.createElement('p');
        message.textContent = 'There is no emails';
        emails_div.appendChild(message);
      }
    })
}


//tag hr == linha horizontal
function view_email(id){
  const email_div = document.querySelector('#emails-view');

  const heading = document.createElement('h3');
  heading.textContent = "Email Details"

  const ul = document.createElement('ul');
  ul.setAttribute('id', 'emails-view-email');

  fetch(`/emails/${id}`).then(response => response.id())
    .then(email => {
      email_div.innerHTML = '';

      const heading_subject = document.createElement('h3');
      heading_subject.innerHTML = email.subject;

      const sender = document.createElement('p');
      sender.textContent = email.sender;

      const recipients_list = document.createElement('ul');
      email.recipients.forEach(recipient => {
        li = document.createElement('p')
        li.innetHTML = recipient

        recipients_list.appendChild(li)
      });


      const body = document.createElement('p');
      body.textContent = email.body;

      const timestamp = document.createElement('p');
      timestamp.textContent = email.timestamp;

      const read = document.createElement('p');
      read.textContent = email.read;

      const archive = document.createElement('p');
      archive.textContent = email.archive;

      email_div.appendChild(heading_subject);
      email_div.appendChild(sender);
      email_div.appendChild(recipients_list);
      email_div.appendChild(body);
      email_div.appendChild(timestamp);
      email_div.appendChild(read);
      email_div.appendChild(archive);

    })
}