const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();


/**
 * ===============================
 * CONSTANTES
 * ===============================
 */

const DEFAULT_PASSWORD = 'senha123';


const USERS = {

  admin: {
    name: 'Admin Sistema',
    email: 'admin@helpdesk.com',
    role: 'ADMIN',
  },


  agent1: {
    name: 'Carlos Oliveira',
    email: 'carlos.agent@helpdesk.com',
    role: 'AGENT',
  },


  agent2: {
    name: 'Mariana Santos',
    email: 'mariana.agent@helpdesk.com',
    role: 'AGENT',
  },


  customer1: {
    name: 'João Silva',
    email: 'joao.cliente@helpdesk.com',
    role: 'USER',
  },


  customer2: {
    name: 'Ana Souza',
    email: 'ana.cliente@helpdesk.com',
    role: 'USER',
  },

};



const TICKETS = [

  {
    title: 'Não consigo acessar minha conta',

    description:
      'Ao tentar realizar login recebo erro 500 no sistema.',

    priority: 'HIGH',

    status: 'OPEN',

    customer: 'customer1',

    agent: 'agent1',
  },


  {
    title: 'Erro ao atualizar cadastro',

    description:
      'Usuário informa que não consegue alterar seus dados pessoais.',

    priority: 'MEDIUM',

    status: 'IN_PROGRESS',

    customer: 'customer2',

    agent: 'agent2',
  },


  {
    title: 'Sistema indisponível',

    description:
      'Aplicação fora do ar para todos os usuários.',

    priority: 'URGENT',

    status: 'OPEN',

    customer: 'customer1',

    agent: 'agent2',
  },


  {
    title: 'Dúvida sobre funcionalidade',

    description:
      'Cliente precisa de orientação sobre uma funcionalidade.',

    priority: 'LOW',

    status: 'RESOLVED',

    customer: 'customer2',

    agent: 'agent1',
  },

];



/**
 * ===============================
 * HELPERS
 * ===============================
 */


function printSection(title) {

  console.log('\n==============================');

  console.log(title);

  console.log('==============================\n');

}



/**
 * ===============================
 * USERS
 * ===============================
 */


async function createUser(data, password) {


  return prisma.user.upsert({

    where: {
      email: data.email,
    },


    update: {},


    create: {

      name: data.name,

      email: data.email,

      password,

      role: data.role,

    },

  });


}



async function createUsers(password) {


  const users = {};


  for (const [key, userData] of Object.entries(USERS)) {


    users[key] =
      await createUser(
        userData,
        password
      );


  }


  return users;

}



/**
 * ===============================
 * TICKETS
 * ===============================
 */


async function createTickets(users) {


  const createdTickets = [];



  for (const ticketData of TICKETS) {



    const ticket =
      await prisma.ticket.create({


        data: {


          title:
            ticketData.title,


          description:
            ticketData.description,


          priority:
            ticketData.priority,


          status:
            ticketData.status,



          createdById:
            users[ticketData.customer].id,



          assignedToId:
            users[ticketData.agent].id,



          history: {

            create: {

              action: 'CREATED',


              description:
                `Ticket criado por ${users[ticketData.customer].name}`,


              userId:
                users[ticketData.customer].id,

            },

          },


        },


      });



    createdTickets.push(ticket);



    console.log(
      `✔ Ticket criado: ${ticket.title}`
    );


  }



  return createdTickets;


}
/**
 * ===============================
 * COMMENTS
 * ===============================
 */


const COMMENTS = [

  {
    ticketIndex: 0,

    user: 'agent1',

    message:
      'Estamos analisando o erro informado. Nossa equipe técnica já foi acionada.',
  },


  {
    ticketIndex: 0,

    user: 'customer1',

    message:
      'Obrigado pelo retorno. O problema começou hoje pela manhã.',
  },


  {
    ticketIndex: 1,

    user: 'agent2',

    message:
      'Identificamos uma inconsistência no cadastro e estamos corrigindo.',
  },


  {
    ticketIndex: 2,

    user: 'agent2',

    message:
      'Incidente crítico identificado. Trabalhando na normalização do serviço.',
  },


  {
    ticketIndex: 3,

    user: 'agent1',

    message:
      'Dúvida esclarecida. Chamado resolvido.',
  },

];



async function createComments(
  tickets,
  users
) {


  const createdComments = [];



  for (const commentData of COMMENTS) {



    const ticket =
      tickets[commentData.ticketIndex];



    const comment =
      await prisma.comment.create({

        data: {


          message:
            commentData.message,


          ticketId:
            ticket.id,


          userId:
            users[commentData.user].id,


        },

      });



    createdComments.push(comment);



    console.log(
      `✔ Comentário criado no ticket ${ticket.id}`
    );


  }



  return createdComments;


}





/**
 * ===============================
 * HISTORY / AUDITORIA
 * ===============================
 */


const STATUS_CHANGES = [

  {
    ticketIndex: 0,

    user: 'agent1',

    from: 'OPEN',

    to: 'IN_PROGRESS',
  },


  {
    ticketIndex: 1,

    user: 'agent2',

    from: 'IN_PROGRESS',

    to: 'RESOLVED',
  },


  {
    ticketIndex: 2,

    user: 'agent2',

    from: 'OPEN',

    to: 'IN_PROGRESS',
  },

];



async function createStatusHistory(
  tickets,
  users
) {


  const history = [];



  for (const change of STATUS_CHANGES) {



    const ticket =
      tickets[change.ticketIndex];



    const item =
      await prisma.history.create({

        data: {


          action:
            'STATUS_CHANGED',



          description:
            `Status alterado de ${change.from} para ${change.to}`,



          ticketId:
            ticket.id,



          userId:
            users[change.user].id,


        },

      });



    history.push(item);



    console.log(
      `✔ Histórico criado para ticket ${ticket.id}`
    );


  }



  return history;


}





/**
 * ===============================
 * SUMMARY
 * ===============================
 */


async function printSummary() {


  const users =
    await prisma.user.count();



  const tickets =
    await prisma.ticket.count();



  const comments =
    await prisma.comment.count();



  const history =
    await prisma.history.count();



  printSection(
    'SEED FINALIZADO'
  );



  console.log(`

Usuários: ${users}

Tickets: ${tickets}

Comentários: ${comments}

Históricos: ${history}

`);



}





/**
 * ===============================
 * MAIN
 * ===============================
 */


async function main() {


  printSection(
    'INICIANDO SEED'
  );



  const password =
    await bcrypt.hash(
      DEFAULT_PASSWORD,
      10
    );



  let users;

  let tickets;



  await prisma.$transaction(
    async () => {



      printSection(
        'CRIANDO USUÁRIOS'
      );



      users =
        await createUsers(
          password
        );



      console.log(
        '✔ Usuários criados'
      );



      printSection(
        'CRIANDO TICKETS'
      );



      tickets =
        await createTickets(
          users
        );



      printSection(
        'CRIANDO COMENTÁRIOS'
      );



      await createComments(
        tickets,
        users
      );



      printSection(
        'CRIANDO HISTÓRICO'
      );



      await createStatusHistory(
        tickets,
        users
      );



    }
  );



  await printSummary();


}





main()

.catch((error) => {


  console.error(

    '\n❌ Erro durante seed:',

    error

  );


  process.exit(1);


})


.finally(async () => {


  await prisma.$disconnect();


});
