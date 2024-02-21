import dotenv from 'dotenv'
dotenv.config()
import { getConnection } from '../../UserRepository/MySQLClient.js'
import bcrypt from 'bcrypt'
import chalk from 'chalk'

async function main() {
  let connection
  try {
    connection = await getConnection()
    console.log(chalk.green('Connected'))
    console.log(chalk.yellow('Dropping existing tables'))
    await dropTableIfExists(connection, 'emails')
    await dropTableIfExists(connection, 'attendees')
    await dropTableIfExists(connection, 'organizers')
    await dropTableIfExists(connection, 'meetups')
    await dropTableIfExists(connection, 'users')

    console.log(chalk.yellow('Creating tables'))
    await createEmailsTable(connection)
    await createUsersTable(connection)
    await createMeetupsTable(connection)
    await createOrganizersTable(connection)
    await createAttendeesTable(connection)

    await insertData(connection)
    await updateCounters(connection)
  } catch (error) {
    console.error(error)
  } finally {
    if (connection) connection.release()
    process.exit()
  }
}

async function dropTableIfExists(connection, tableName) {
  await connection.query(`SET FOREIGN_KEY_CHECKS = 0`)
  await connection.query(`DROP TABLE IF EXISTS ${tableName}`)
  console.log(chalk.green(`Table ${tableName} dropped if exists.`))
}

async function createEmailsTable(connection) {
  await connection.query(`
CREATE TABLE IF NOT EXISTS email_verification (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
    token VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  `)
  console.log(chalk.green('Table emails created'))
}

async function createUsersTable(connection) {
  await connection.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    bio VARCHAR(255) NOT NULL,
    email VARCHAR(90) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    meetups_attended INT DEFAULT 0,  
    avatar VARCHAR(255),
    isActivated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`)

  const usersToInsert = [
    {
      username: 'ana_garcia',
      bio: 'Bio de Ana Garcia',
      email: 'ana_garcia@example.com',
      avatar: '../../uploads/user1.jpg',
      password: 'password1',
      isActivated: true,
    },
    {
      username: 'pedro_rodriguez',
      bio: 'Bio de Pedro Rodriguez',
      email: 'pedro_rodriguez@example.com',
      avatar: '../../uploads/user2.jpg',
      password: 'password2',
      isActivated: true,
    },
    {
      username: 'laura_fernandez',
      bio: 'Bio de Laura Fernandez',
      email: 'laura_fernandez@example.com',
      avatar: '../../uploads/user3.jpg',
      password: 'password3',
      isActivated: true,
    },
    {
      username: 'carlos_martinez',
      bio: 'Bio de Carlos Martinez',
      email: 'carlos_martinez@example.com',
      avatar: '../../uploads/user4.jpg',
      password: 'password4',
      isActivated: true,
    },
    {
      username: 'claudia_lopez',
      bio: 'Bio de Claudia Lopez',
      email: 'claudia_lopez@example.com',
      avatar: '../../uploads/user5.jpg',
      password: 'password5',
      isActivated: true,
    },
    {
      username: 'sergio_perez',
      bio: 'Bio de Sergio Perez',
      email: 'sergio_perez@example.com',
      avatar: '../../uploads/user6.jpg',
      password: 'password6',
      isActivated: true,
    },
    {
      username: 'maria_gomez',
      bio: 'Bio de Maria Gomez',
      email: 'maria_gomez@example.com',
      avatar: '../../uploads/user7.jpg',
      password: 'password7',
      isActivated: true,
    },
    {
      username: 'andrea_martin',
      bio: 'Bio de Andrea Martin',
      email: 'andrea_martin@example.com',
      avatar: '../../uploads/user8.jpg',
      password: 'password8',
      isActivated: true,
    },
    {
      username: 'jose_sanchez',
      bio: 'Bio de Jose Sanchez',
      email: 'jose_sanchez@example.com',
      avatar: '../../uploads/user9.jpg',
      password: 'password9',
      isActivated: true,
    },
    {
      username: 'lucia_lopez',
      bio: 'Bio de Lucia Lopez',
      email: 'lucia_lopez@example.com',
      avatar: '../../uploads/user10.jpg',
      password: 'password10',
      isActivated: true,
    },
    {
      username: 'juan_rodriguez',
      bio: 'Bio de Juan Rodriguez',
      email: 'juan_rodriguez@example.com',
      avatar: '../../uploads/user11.jpg',
      password: 'password11',
      isActivated: true,
    },
    {
      username: 'carmen_perez',
      bio: 'Bio de Carmen Perez',
      email: 'carmen_perez@example.com',
      avatar: '../../uploads/user12.jpg',
      password: 'password12',
      isActivated: true,
    },
    {
      username: 'alberto_martin',
      bio: 'Bio de Alberto Martin',
      email: 'alberto_martin@example.com',
      avatar: '../../uploads/user13.jpg',
      password: 'password13',
      isActivated: true,
    },
    {
      username: 'elena_gomez',
      bio: 'Bio de Elena Gomez',
      email: 'elena_gomez@example.com',
      avatar: '../../uploads/user14.jpg',
      password: 'password14',
      isActivated: true,
    },
    {
      username: 'pablo_rodriguez',
      bio: 'Bio de Pablo Rodriguez',
      email: 'pablo_rodriguez@example.com',
      avatar: '../../uploads/user15.jpg',
      password: 'password15',
      isActivated: true,
    },
    {
      username: 'irene_sanchez',
      bio: 'Bio de Irene Sanchez',
      email: 'irene_sanchez@example.com',
      avatar: '../../uploads/user16.jpg',
      password: 'password16',
      isActivated: true,
    },
    {
      username: 'sergio_martin',
      bio: 'Bio de Sergio Martin',
      email: 'sergio_martin@example.com',
      avatar: '../../uploads/user17.jpg',
      password: 'password17',
      isActivated: true,
    },
    {
      username: 'clara_gomez',
      bio: 'Bio de Clara Gomez',
      email: 'clara_gomez@example.com',
      avatar: '../../uploads/user18.jpg',
      password: 'password18',
      isActivated: true,
    },
    {
      username: 'daniel_rodriguez',
      bio: 'Bio de Daniel Rodriguez',
      email: 'daniel_rodriguez@example.com',
      avatar: '../../uploads/user19.jpg',
      password: 'password19',
      isActivated: true,
    },
    {
      username: 'alba_perez',
      bio: 'Bio de Alba Perez',
      email: 'alba_perez@example.com',
      avatar: '../../uploads/user20.jpg',
      password: 'password20',
      isActivated: true,
    },
    {
      username: 'juanita_martin',
      bio: 'Bio de Juanita Martin',
      email: 'juanita_martin@example.com',
      avatar: '../../uploads/user21.jpg',
      password: 'password21',
      isActivated: true,
    },
    {
      username: 'raul_gomez',
      bio: 'Bio de Raul Gomez',
      email: 'raul_gomez@example.com',
      avatar: '../../uploads/user22.jpg',
      password: 'password22',
      isActivated: true,
    },
    {
      username: 'sofia_rodriguez',
      bio: 'Bio de Sofia Rodriguez',
      email: 'sofia_rodriguez@example.com',
      avatar: '../../uploads/user23.jpg',
      password: 'password23',
      isActivated: true,
    },
    {
      username: 'adrian_sanchez',
      bio: 'Bio de Adrian Sanchez',
      email: 'adrian_sanchez@example.com',
      avatar: '../../uploads/user24.jpg',
      password: 'password24',
      isActivated: true,
    },
    {
      username: 'elisa_martin',
      bio: 'Bio de Elisa Martin',
      email: 'elisa_martin@example.com',
      avatar: '../../uploads/user25.jpg',
      password: 'password25',
      isActivated: true,
    },
  ]

  for (const user of usersToInsert) {
    const saltRounds = 10
    user.password = await bcrypt.hash(user.password, saltRounds)
    await connection.query(`INSERT INTO users SET ?`, user)
  }

  console.log(chalk.green('Table users created and populated with 5 users.'))
}

async function createMeetupsTable(connection) {
  await connection.query(`
  CREATE TABLE IF NOT EXISTS meetups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(40) NOT NULL,
  description VARCHAR(255) NOT NULL,
  picture VARCHAR(255) NOT NULL,
  theme VARCHAR(255) NOT NULL,
  location VARCHAR(40) NOT NULL,
  address VARCHAR(100) NOT NULL,
  date DATETIME NOT NULL, -- O TIMESTAMP
  time TIME NOT NULL,
  attendees_count INT DEFAULT 0,  
  organizer_id INT, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id) 
);
  `)

  const meetupsToInsert = [
    // Online Events
    {
      title: 'Online Tech Forum',
      description:
        'Engage in insightful discussions on cutting-edge tech topics. Join us virtually to stay updated and connected with the latest advancements in technology.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Online Events',
      location: 'Valencia',
      address: 'Virtual Event',
      date: '2024-03-15',
      time: '18:00:00',
      organizer_id: 2,
    },
    {
      title: 'Virtual Gaming Night',
      description:
        'Join us for a live gaming session with fellow enthusiasts. Connect, play, and have a blast in the virtual gaming world!',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Online Events',
      location: 'A Coruña',
      address: 'Virtual Event',
      date: '2024-03-20',
      time: '20:00:00',
      organizer_id: 4,
    },
    {
      title: 'Virtual Reality Expo',
      description:
        'Dive into the world of virtual reality! Experience the latest VR innovations and connect with like-minded individuals.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Online Events',
      location: 'La Laguna',
      address: 'Virtual Event',
      date: '2024-03-25',
      time: '16:00:00',
      organizer_id: 1,
    },
    {
      title: 'Digital Board Game Night',
      description:
        'Grab your favorite digital board game and join us for a night of strategy, fun, and friendly competition.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Online Events',
      location: 'Sao Paulo',
      address: 'Virtual Event',
      date: '2024-04-01',
      time: '19:00:00',
      organizer_id: 3,
    },
    {
      title: 'Online Cosplay Showcase',
      description:
        'Showcase your amazing cosplay creations in our virtual cosplay event. Join us for a celebration of creativity and fandom!',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Online Events',
      location: 'Lisboa',
      address: 'Virtual Event',
      date: '2024-04-05',
      time: '17:30:00',
      organizer_id: 5,
    },

    // Videogames
    {
      title: 'Gaming Marathon',
      description:
        'Embark on a gaming marathon with fellow gamers. Play, compete, and share your gaming experiences!',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Videogames',
      location: 'Londres',
      address: '123 Gaming Street',
      date: '2024-04-10',
      time: '12:00:00',
      organizer_id: 1,
    },
    {
      title: 'Retro Gaming Night',
      description:
        'Take a trip down memory lane with classic retro games. Join us for a night of nostalgia and gaming fun!',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Videogames',
      location: 'Tokio',
      address: '456 Retro Avenue',
      date: '2024-04-15',
      time: '18:30:00',
      organizer_id: 3,
    },
    {
      title: 'Esports Tournament',
      description:
        'Compete in our esports tournament and showcase your gaming skills. Join us for an adrenaline-fueled gaming experience!',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Videogames',
      location: 'Santa Cruz de Tenerife',
      address: '789 Esports Lane',
      date: '2024-04-20',
      time: '17:00:00',
      organizer_id: 2,
    },
    {
      title: 'Indie Game Showcase',
      description:
        'Discover hidden gems in the world of indie games. Join us for an evening of unique and innovative gaming experiences.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Videogames',
      location: 'Bogota',
      address: '890 Indie Court',
      date: '2024-04-25',
      time: '19:30:00',
      organizer_id: 4,
    },
    {
      title: 'Virtual Reality Gaming Night',
      description:
        'Immerse yourself in the world of virtual reality gaming. Join us for a night of cutting-edge technology and gaming excitement!',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Videogames',
      location: 'Lima',
      address: 'Virtual Event',
      date: '2024-05-01',
      time: '20:00:00',
      organizer_id: 5,
    },

    // Technology
    {
      title: 'Tech Talks and Networking',
      description:
        'Engage in insightful discussions on cutting-edge tech topics. Network with fellow tech enthusiasts and professionals.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Technology',
      location: 'Toronto',
      address: '234 Tech Boulevard',
      date: '2024-05-05',
      time: '19:00:00',
      organizer_id: 1,
    },
    {
      title: 'Startup Showcase',
      description:
        'Discover the latest innovations in the startup world. Join us for a showcase of groundbreaking ideas and entrepreneurial spirit.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Technology',
      location: 'Valencia',
      address: '567 Startup Street',
      date: '2024-05-10',
      time: '18:30:00',
      organizer_id: 3,
    },
    {
      title: 'AI and Robotics Symposium',
      description:
        'Explore the future of AI and robotics. Join experts in the field for a symposium on the latest advancements and applications.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Technology',
      location: 'La Laguna',
      address: '789 Tech Lane',
      date: '2024-05-15',
      time: '17:00:00',
      organizer_id: 2,
    },
    {
      title: 'Cybersecurity Workshop',
      description:
        'Enhance your cybersecurity knowledge and skills. Join us for a hands-on workshop led by industry experts.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Technology',
      location: 'Sao Paulo',
      address: '890 Cyber Street',
      date: '2024-05-20',
      time: '16:30:00',
      organizer_id: 4,
    },
    {
      title: 'Virtual Hackathon',
      description:
        'Participate in our virtual hackathon and showcase your coding skills. Collaborate with fellow developers and solve real-world challenges.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Technology',
      location: 'Lisboa',
      address: 'Virtual Event',
      date: '2024-05-25',
      time: '15:00:00',
      organizer_id: 5,
    },

    // Board Games
    {
      title: 'Board Game Night',
      description:
        'Get ready for a night of board game fun with fellow enthusiasts. Roll the dice, strategize, and enjoy a friendly competition.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Board Games',
      location: 'Tokio',
      address: '101 Boardwalk',
      date: '2024-06-01',
      time: '19:00:00',
      organizer_id: 1,
    },
    {
      title: 'Strategy Board Games Day',
      description:
        'Test your strategic skills in a day dedicated to strategy board games. Join us for a day of tactical gameplay and fun.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Board Games',
      location: 'Santa Cruz de Tenerife',
      address: '456 Strategy Court',
      date: '2024-06-05',
      time: '15:30:00',
      organizer_id: 3,
    },
    {
      title: 'Family Board Game Afternoon',
      description:
        'Bring your family for an afternoon of board game bonding. Discover new family favorites and create lasting memories.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Board Games',
      location: 'Bogota',
      address: '890 Family Lane',
      date: '2024-06-10',
      time: '14:00:00',
      organizer_id: 2,
    },
    {
      title: 'Euro-style Board Game Meetup',
      description:
        'Explore the world of Euro-style board games. Join us for an evening of strategy, resource management, and friendly competition.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Board Games',
      location: 'Lima',
      address: '567 Euro Avenue',
      date: '2024-06-15',
      time: '18:30:00',
      organizer_id: 4,
    },
    {
      title: 'Virtual Board Game Hangout',
      description:
        'Connect with fellow board game enthusiasts in our virtual hangout. Play your favorite games and make new friends!',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Board Games',
      location: 'Toronto',
      address: 'Virtual Event',
      date: '2024-06-20',
      time: '17:00:00',
      organizer_id: 5,
    },

    // Conventions and Cosplay
    {
      title: 'Cosplay Convention',
      description:
        'Celebrate the art of cosplay at our annual convention. Showcase your costumes, attend panels, and join the cosplay community.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Conventions and Cosplay',
      location: 'A Coruña',
      address: '123 Cosplay Street',
      date: '2024-06-25',
      time: '16:00:00',
      organizer_id: 1,
    },
    {
      title: 'Anime Expo',
      description:
        'Immerse yourself in the world of anime at our expo. Enjoy screenings, meet voice actors, and connect with fellow anime enthusiasts.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Conventions and Cosplay',
      location: 'Valencia',
      address: '567 Anime Lane',
      date: '2024-06-30',
      time: '19:30:00',
      organizer_id: 3,
    },
    {
      title: 'Comic Book Fair',
      description:
        'Explore a diverse selection of comic books at our fair. Discover rare finds, meet artists, and celebrate the world of comics.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Conventions and Cosplay',
      location: 'La Laguna',
      address: '789 Comic Court',
      date: '2024-07-05',
      time: '18:00:00',
      organizer_id: 2,
    },
    {
      title: 'Fantasy Cosplay Ball',
      description:
        'Step into a world of fantasy at our cosplay ball. Dress up as your favorite characters and dance the night away in a magical atmosphere.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Conventions and Cosplay',
      location: 'Sao Paulo',
      address: '456 Fantasy Avenue',
      date: '2024-07-10',
      time: '20:00:00',
      organizer_id: 4,
    },
    {
      title: 'Sci-Fi Convention',
      description:
        'Explore the wonders of science fiction at our convention. Engage in discussions, meet authors, and celebrate the world of sci-fi.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Conventions and Cosplay',
      location: 'Lisboa',
      address: '890 Sci-Fi Lane',
      date: '2024-07-15',
      time: '17:30:00',
      organizer_id: 5,
    },
  ]

  for (const meetup of meetupsToInsert) {
    await connection.query(`INSERT INTO meetups SET ?`, meetup)
  }

  console.log(
    chalk.green('Table Meetups created and populated with 5 meetups.'),
  )
}

async function createOrganizersTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS organizers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      meetup_id INT,
      username VARCHAR(50),  -- Agregar la columna username
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (meetup_id) REFERENCES Meetups(id)
    )
  `)

  console.log(chalk.green('Table Organizers created.'))
}

async function createAttendeesTable(connection) {
  await connection.query(`CREATE TABLE IF NOT EXISTS attendees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meetup_id INT,
    user_id INT,
    username VARCHAR(50),
    will_attend BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meetup_id) REFERENCES Meetups(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`)

  console.log(chalk.green('Table Attendees created.'))
}

async function insertData(connection) {
  const organizersToInsert = [
    { user_id: 1, meetup_id: 1, username: 'ana_garcia' },
    { user_id: 2, meetup_id: 2, username: 'pedro_rodriguez' },
    { user_id: 3, meetup_id: 3, username: 'pepe_fernandez' },
    { user_id: 4, meetup_id: 4, username: 'maria_perez' },
    { user_id: 5, meetup_id: 5, username: 'juana_martinez' },
    { user_id: 6, meetup_id: 6, username: 'juan_gomez' },
    { user_id: 7, meetup_id: 7, username: 'laura_rodriguez' },
    { user_id: 8, meetup_id: 8, username: 'carlos_sanchez' },
    { user_id: 9, meetup_id: 9, username: 'martina_fernandez' },
    { user_id: 10, meetup_id: 10, username: 'david_lopez' },
    { user_id: 11, meetup_id: 11, username: 'sara_gomez' },
    { user_id: 12, meetup_id: 12, username: 'lucas_hernandez' },
    { user_id: 13, meetup_id: 13, username: 'clara_martinez' },
    { user_id: 14, meetup_id: 14, username: 'alberto_gonzalez' },
    { user_id: 15, meetup_id: 15, username: 'patricia_fernandez' },
    { user_id: 16, meetup_id: 16, username: 'javier_lopez' },
    { user_id: 17, meetup_id: 17, username: 'natalia_martinez' },
    { user_id: 18, meetup_id: 18, username: 'sergio_gomez' },
    { user_id: 19, meetup_id: 19, username: 'ana_sanchez' },
    { user_id: 20, meetup_id: 20, username: 'raul_hernandez' },
    { user_id: 21, meetup_id: 21, username: 'lucia_gonzalez' },
    { user_id: 22, meetup_id: 22, username: 'manuel_lopez' },
    { user_id: 23, meetup_id: 23, username: 'elena_martinez' },
    { user_id: 24, meetup_id: 24, username: 'pablo_rodriguez' },
    { user_id: 25, meetup_id: 25, username: 'irene_sanchez' },
  ]

  const attendeesToInsert = [
    { meetup_id: 1, user_id: 1, username: 'ana_garcia', will_attend: true },
    {
      meetup_id: 1,
      user_id: 2,
      username: 'pedro_rodriguez',
      will_attend: true,
    },
    { meetup_id: 1, user_id: 3, username: 'pepe_fernandez', will_attend: true },
    { meetup_id: 1, user_id: 4, username: 'maria_perez', will_attend: true },
    { meetup_id: 1, user_id: 6, username: 'juana_martinez', will_attend: true },
    { meetup_id: 1, user_id: 7, username: 'juan_gomez', will_attend: true },
    {
      meetup_id: 1,
      user_id: 8,
      username: 'laura_rodriguez',
      will_attend: true,
    },
    { meetup_id: 1, user_id: 9, username: 'carlos_sanchez', will_attend: true },
    {
      meetup_id: 1,
      user_id: 10,
      username: 'martina_fernandez',
      will_attend: true,
    },
    { meetup_id: 1, user_id: 11, username: 'david_lopez', will_attend: true },
    { meetup_id: 1, user_id: 12, username: 'sara_gomez', will_attend: true },
    {
      meetup_id: 1,
      user_id: 13,
      username: 'lucas_hernandez',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 14,
      username: 'clara_martinez',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 16,
      username: 'alberto_gonzalez',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 17,
      username: 'patricia_fernandez',
      will_attend: true,
    },
    { meetup_id: 1, user_id: 18, username: 'javier_lopez', will_attend: true },
    {
      meetup_id: 1,
      user_id: 19,
      username: 'natalia_martinez',
      will_attend: true,
    },
    { meetup_id: 1, user_id: 20, username: 'sergio_gomez', will_attend: true },
    { meetup_id: 1, user_id: 21, username: 'ana_sanchez', will_attend: true },
    {
      meetup_id: 1,
      user_id: 22,
      username: 'raul_hernandez',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 23,
      username: 'lucia_gonzalez',
      will_attend: true,
    },
    { meetup_id: 1, user_id: 24, username: 'manuel_lopez', will_attend: true },
    {
      meetup_id: 1,
      user_id: 25,
      username: 'elena_martinez',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 5,
      username: 'lucia_gonzalez',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 3,
      username: 'lucia_gonzalez',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 2,
      username: 'lucia_gonzalez',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 14,
      username: 'lucia_gonzalez',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 12,
      username: 'lucia_gonzalez',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 11,
      username: 'lucia_gonzalez',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 19,
      username: 'lucia_gonzalez',
      will_attend: true,
    },
    { meetup_id: 2, user_id: 3, username: 'pepe_fernandez', will_attend: true },
    { meetup_id: 2, user_id: 4, username: 'maria_perez', will_attend: true },
    { meetup_id: 3, user_id: 3, username: 'pepe_fernandez', will_attend: true },
    { meetup_id: 3, user_id: 1, username: 'ana_garcia', will_attend: true },
    {
      meetup_id: 5,
      user_id: 2,
      username: 'pedro_rodriguez',
      will_attend: true,
    },
    { meetup_id: 5, user_id: 3, username: 'pepe_fernandez', will_attend: true },
    { meetup_id: 5, user_id: 4, username: 'maria_perez', will_attend: true },
    { meetup_id: 5, user_id: 5, username: 'juana_martinez', will_attend: true },
  ]

  for (const organizer of organizersToInsert) {
    await connection.query(`INSERT INTO organizers SET ?`, organizer)
  }

  for (const attendee of attendeesToInsert) {
    await connection.query(`INSERT INTO attendees SET ?`, attendee)
  }

  console.log(chalk.green('Data inserted.'))
}

async function updateCounters(connection) {
  await connection.query(`
    UPDATE meetups
    SET attendees_count = (
      SELECT COUNT(*)
      FROM attendees
      WHERE Attendees.meetup_id = Meetups.id
      AND Attendees.will_attend = 1
    )
  `)

  await connection.query(`
    UPDATE users
    SET meetups_attended = (
      SELECT COUNT(*)
      FROM attendees
      WHERE Attendees.user_id = users.id
      AND Attendees.will_attend = 1
    )
  `)

  console.log(chalk.green('Attendees updated.'))
}

main()
