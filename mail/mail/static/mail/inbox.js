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
      //redireciona para emails enviados
      load_mailbox('sent');
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

          if(email.read){
            //todo: lido -> fundo cinza
            //todo: nao_lido -> fundo branco
            li.setAttribute('class', 'emails-view-item-read')
          }else{
            li.setAttribute('class', 'emails-view-item')
          }
          
          li.innerHTML = `<strong>${email.sender}</strong>  ${email.subject}  ${email.timestamp}`;
          li.style.cursor = 'pointer';

          li.addEventListener('click', () => view_email(email.id, mailbox));

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

//todo: testar multiplos remetentes
//tag hr == linha horizontal
function view_email(id, mailbox){
  const email_div = document.querySelector('#emails-view');

  const heading = document.createElement('h3');
  heading.textContent = "Email Details"

  const ul = document.createElement('ul');
  ul.setAttribute('id', 'emails-view-email');

  fetch(`/emails/${id}`).then(response => response.json())
    .then(email => {
      email_div.innerHTML = '';

      const heading_subject = document.createElement('h3');
      heading_subject.innerHTML = email.subject;

      const sender_li = document.createElement('li');
      sender_li.innerHTML = email.sender;

      const recipients_list = document.createElement('ul');
      email.recipients.forEach(recipient => {
        const li = document.createElement('li')
        li.innerHTML = recipient

        recipients_list.appendChild(li)
      });

      const body_li = document.createElement('li');
      body_li.innerHTML = email.body;

      const timestamp_li = document.createElement('li');
      timestamp_li.innerHTML = email.timestamp;

      const archive_li = document.createElement('li');
      archive_li.innerHTML = email.archived;

      email_div.appendChild(heading_subject);

      
      if(mailbox === 'archive' || mailbox === 'inbox'){
        email_archived(email);
      }

      email_div.appendChild(sender_li);
      email_div.appendChild(recipients_list);
      email_div.appendChild(body_li);
      email_div.appendChild(timestamp_li);
      email_div.appendChild(archive_li);

      email_read(id);
    })
}

function email_read(id){
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read : true
    })
  });
}

function email_archived(email){
  const button_archive = document.createElement('button');
  button_archive.setAttribute('class', 'btn btn-sm btn-outline-primary');
  button_archive.setAttribute('id', 'emails-view-button-archive')
  button_archive.innerText = email.archived ? 'Unarchive' : 'Archive';

  document.querySelector('#emails-view').appendChild(button_archive);

  const fetch_archived_status = !email.archived;

  button_archive.addEventListener('click', () => {
    fetch(`/emails/${email.id}`, {
      method : 'PUT',
      body : JSON.stringify({
        archived : fetch_archived_status
      })
    }).then(response => {
      console.log(response)
      email.archived = fetch_archived_status
      button_archive.innerText = email.archived ? 'Unarchive' : 'Archive'

      load_mailbox('inbox')
    })
  })//end listener
}
