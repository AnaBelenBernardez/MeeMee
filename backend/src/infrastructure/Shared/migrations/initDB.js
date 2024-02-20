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
      username: 'user1',
      bio: 'Bio de usuario 1',
      email: 'user1@example.com',
      avatar: '../../uploads/default_avatar.png',
      password: 'password1',
      isActivated: true,
    },
    {
      username: 'user2',
      bio: 'Bio de usuario 2',
      email: 'user2@example.com',
      avatar: '../../uploads/default_avatar.png',
      password: 'password2',
      isActivated: true,
    },
    {
      username: 'user3',
      bio: 'Bio de usuario 3',
      email: 'user3@example.com',
      avatar: '../../uploads/default_avatar.png',
      password: 'password3',
      isActivated: true,
    },
    {
      username: 'user4',
      bio: 'Bio de usuario 4',
      email: 'user4@example.com',
      avatar: '../../uploads/default_avatar.png',
      password: 'password4',
      isActivated: true,
    },
    {
      username: 'user5',
      bio: 'Bio de usuario 5',
      email: 'user5@example.com',
      avatar: '../../uploads/default_avatar.png',
      password: 'password5',
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
    {
      title: 'Tech Talks',
      description:
        'Engage in insightful discussions on cutting-edge tech topics. Stay updated and connected with the latest advancements in the world of technology.',
      picture:
        'https://images.unsplash.com/photo-1576085898323-218337e3e43c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Technology',
      location: 'La Laguna',
      address: '567 Tech Street',
      date: '2024-03-01',
      time: '15:00:00',
      organizer_id: 3,
    },
    {
      title: 'Craft Fair',
      description:
        'Explore a diverse selection of handmade treasures from local artisans. Support small businesses and find unique, one-of-a-kind items!',
      picture:
        'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Art and Culture',
      location: 'Londres',
      address: '123 Crafty Court',
      date: '2024-03-01',
      time: '10:00:00',
      organizer_id: 5,
    },
    {
      title: 'Music Mixer',
      description:
        'Connect with fellow music lovers and discover new tunes! Join us for an evening of music, mingling, and good vibes.',
      picture:
        'https://images.unsplash.com/photo-1641751585463-586fa52bbd79?q=80&w=1126&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Art and Culture',
      location: 'Lisboa',
      address: '456 Melody Lane',
      date: '2024-03-01',
      time: '18:00:00',
      organizer_id: 1,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },

    {
      title: 'Board Game Bash',
      description:
        'Get ready for a day of board game fun with fellow enthusiasts! Roll the dice, strategize, and enjoy a friendly competition in a welcoming environment.',
      picture:
        'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'La Laguna',
      address: '101 Boardwalk',
      date: '2024-09-01',
      time: '13:00:00',
      organizer_id: 1,
    },
    {
      title: 'Artistic Meet',
      description:
        'Discover the beauty of artistic expression at our gathering. Immerse yourself in a world of creativity and inspiration!',
      picture:
        'https://plus.unsplash.com/premium_photo-1705700639410-3dc17ab0fb99?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Art and Culture',
      location: 'A Coruña',
      address: '456 Art Avenue',
      date: '2024-08-01',
      time: '14:00:00',
      organizer_id: 5,
    },
    {
      title: 'Gaming Fun',
      description:
        'Join us for a day filled with gaming excitement! Experience the thrill of competition and camaraderie as we delve into the world of video games.',
      picture:
        'https://plus.unsplash.com/premium_photo-1675257062614-c1da6b8d83ee?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Videogames',
      location: 'Londres',
      address: '123 Gaming Street',
      date: '2024-07-01',
      time: '12:00:00',
      organizer_id: 1,
    },
    {
      title: 'Design Inspiration',
      description:
        'Explore the latest design trends and techniques at our inspirational event. Get motivated and unleash your creativity!',
      picture:
        'https://images.unsplash.com/photo-1690733546457-029606fbc0e6?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Art and Culture',
      location: 'A Coruña',
      address: '234 Design Boulevard',
      date: '2024-08-01',
      time: '11:00:00',
      organizer_id: 4,
    },

    {
      title: 'Creative Writing Workshop',
      description:
        'Unleash your creativity through the power of words! Join us for a workshop filled with writing exercises, tips, and inspiration.',
      picture:
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Art and Culture',
      location: 'Bilbao',
      address: '890 Writers Lane',
      date: '2024-10-01',
      time: '16:00:00',
      organizer_id: 2,
    },
    {
      title: 'Code & Coffee',
      description:
        'A casual gathering for coding enthusiasts over coffee. Dive into discussions about the latest technologies and coding trends while enjoying a cup of joe.',
      picture:
        'https://images.unsplash.com/photo-1508739826987-b79cd8b7da12?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Technology',
      location: 'La Laguna',
      address: '789 Code Lane',
      date: '2024-10-01',
      time: '10:00:00',
      organizer_id: 2,
    },

    {
      title: 'Photography Walk',
      description:
        'Capture the beauty of our city through your lens! Join us for a photowalk adventure and sharpen your photography skills.',
      picture:
        'https://images.unsplash.com/photo-1518534106112-7e2d9b85760a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Sports and Fitness',
      location: 'Valencia',
      address: '789 Shutter Street',
      date: '2025-01-01',
      time: '09:00:00',
      organizer_id: 1,
    },

    {
      title: 'Tech Startup Symposium',
      description:
        'Learn from industry experts and network with fellow entrepreneurs! Gain valuable insights and connections to fuel your startup journey.',
      picture:
        'https://images.unsplash.com/photo-1564522365984-c08ed1f78893?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Technology',
      location: 'Valencia',
      address: '234 Startup Street',
      date: '2025-03-01',
      time: '11:00:00',
      organizer_id: 2,
    },

    {
      title: 'Art Exhibition Opening',
      description:
        'Experience the beauty of local artistry at our exhibition opening! Join us for an evening of art, culture, and celebration.',
      picture:
        'https://images.unsplash.com/photo-1545987796-b199d6abb1b4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Art and Culture',
      location: 'A Coruña',
      address: '567 Artistic Avenue',
      date: '2025-04-01',
      time: '17:00:00',
      organizer_id: 5,
    },
    {
      title: 'Pride Parade & Rally',
      description:
        'Celebrate love, diversity, and equality with us at the annual Pride Parade! Join us as we march together in solidarity and support of the LGBT community.',
      picture:
        'https://images.unsplash.com/photo-1564694457547-6ea79902e0be?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '890 Code Court',
      date: '2024-06-28',
      time: '12:00:00',
      organizer_id: 1,
    },

    {
      title: 'Code & Chill',
      description:
        'Relax and code with like-minded individuals in a laid-back atmosphere. Whether you are a coding novice or expert, come unwind and code with us!',
      picture:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Technology',
      location: 'Bilbao',
      address: '890 Code Court',
      date: '2025-05-01',
      time: '12:00:00',
      organizer_id: 1,
    },
    {
      title: 'March for Palestine',
      description:
        'Join us in standing up for justice and equality! Lets raise our voices together to support human rights in Palestine.',
      picture:
        'https://images.unsplash.com/photo-1698622946425-09076f9fb5de?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'A Coruña',
      address: '123 Crafty Court',
      date: '2024-06-01',
      time: '15:00:00',
      organizer_id: 1,
    },

    {
      title: 'Crafting Corner',
      description:
        'Unleash your creativity and make something unique! Join us for a crafting session filled with inspiration, supplies, and good company.',
      picture:
        'https://plus.unsplash.com/premium_photo-1677185063030-75d40ee7d5e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Art and Culture',
      location: 'Lisboa',
      address: '123 Crafty Court',
      date: '2025-06-01',
      time: '15:00:00',
      organizer_id: 4,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
    },
    {
      title: 'DnD campaign',
      description:
        'Roll the dice and join us for a day of dungeon fun! Whether you are a seasoned player or new to the world of dungeon and dragons, there is something for everyone.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Social Events',
      location: 'Bilbao',
      address: '101 Boardwalk',
      date: '2024-03-01',
      time: '14:00:00',
      organizer_id: 3,
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
    { user_id: 1, meetup_id: 1, username: 'user1' },
    { user_id: 2, meetup_id: 2, username: 'user2' },
    { user_id: 3, meetup_id: 3, username: 'user3' },
    { user_id: 4, meetup_id: 4, username: 'user4' },
    { user_id: 5, meetup_id: 5, username: 'user5' },
  ]

  const attendeesToInsert = [
    { meetup_id: 1, user_id: 1, username: 'user1', will_attend: true },
    { meetup_id: 1, user_id: 2, username: 'user2', will_attend: true },
    { meetup_id: 1, user_id: 3, username: 'user3', will_attend: true },
    { meetup_id: 1, user_id: 4, username: 'user4', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },

    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 1, user_id: 5, username: 'user5', will_attend: true },
    { meetup_id: 2, user_id: 3, username: 'user3', will_attend: true },
    { meetup_id: 2, user_id: 4, username: 'user4', will_attend: true },
    { meetup_id: 3, user_id: 3, username: 'user3', will_attend: true },
    { meetup_id: 3, user_id: 1, username: 'user1', will_attend: true },
    { meetup_id: 5, user_id: 2, username: 'user2', will_attend: true },
    { meetup_id: 5, user_id: 3, username: 'user3', will_attend: true },
    { meetup_id: 5, user_id: 4, username: 'user4', will_attend: true },
    { meetup_id: 5, user_id: 5, username: 'user5', will_attend: true },
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
