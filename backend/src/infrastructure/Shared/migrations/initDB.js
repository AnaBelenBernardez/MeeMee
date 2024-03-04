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
      username: 'CyberGamer92',
      bio: 'Gaming enthusiast since the 90s. Exploring virtual worlds and mastering online circuits. Always on the lookout for the next cyber adventure!',
      email: 'user1@example.com',
      avatar: '../../uploads/user1.jpg',
      password: 'password1',
      isActivated: true,
    },
    {
      username: 'GeekXpert',
      bio: 'Technology expert with an unbreakable love for innovation. Turning ideas into digital reality and exploring the latest tech trends.',
      email: 'pedro_rodriguez@example.com',
      avatar: '../../uploads/user2.jpg',
      password: 'password2',
      isActivated: true,
    },
    {
      username: 'EqualityEmissary',
      bio: 'Advocate for equality and inclusion. Fighting for a world where everyone is treated with respect and dignity. A committed ally to social justice!',
      email: 'laura_fernandez@example.com',
      avatar: '../../uploads/user3.jpg',
      password: 'password3',
      isActivated: true,
    },
    {
      username: 'BoardGameJunkie',
      bio: ' Board game addict since the first roll of the dice. Tactical strategist and card master. Always ready for a night of fun and friendly competition!',
      email: 'carlos_martinez@example.com',
      avatar: '../../uploads/user4.jpg',
      password: 'password4',
      isActivated: true,
    },
    {
      username: 'CodeWarlock77',
      bio: 'Programming wizard with over 10 years of spellbinding code experience. Crafting magical solutions for complex technological problems.',
      email: 'claudia_lopez@example.com',
      avatar: '../../uploads/user5.jpg',
      password: 'password5',
      isActivated: true,
    },
    {
      username: 'RetroGamerRevival',
      bio: 'Bringing back the golden age of gaming. Explorer of retro classics and collector of vintage consoles. Time-traveling through pixels and sound waves!',
      email: 'sergio_perez@example.com',
      avatar: '../../uploads/user6.jpg',
      password: 'password6',
      isActivated: true,
    },
    {
      username: 'CardGameMaestro',
      bio: 'Connoisseur of card games and master of strategic plays. Commanding decks with finesse and skill, always ready to outwit opponents and claim victory!',
      email: 'maria_gomez@example.com',
      avatar: '../../uploads/user7.jpg',
      password: 'password7',
      isActivated: true,
    },
    {
      username: 'DigiArtisan2021',
      bio: 'Crafting digital art with precision and passion. Blending creativity with technology to bring visions to life in the digital realm. A true artisan of the digital age!',
      email: 'andrea_martin@example.com',
      avatar: '../../uploads/user8.jpg',
      password: 'password8',
      isActivated: true,
    },
    {
      username: 'GameDevNerd99',
      bio: ' Devoted to game development since 99. Crafting immersive worlds and captivating gameplay experiences. Pushing boundaries and shaping the future of gaming!',
      email: 'jose_sanchez@example.com',
      avatar: '../../uploads/user9.jpg',
      password: 'password9',
      isActivated: true,
    },
    {
      username: 'EsportsFanaticX',
      bio: 'Avid follower of esports competitions and dedicated supporter of gaming communities. Cheering on favorite teams and celebrating the thrill of competitive gaming!',
      email: 'lucia_lopez@example.com',
      avatar: '../../uploads/user10.jpg',
      password: 'password10',
      isActivated: true,
    },
    {
      username: 'FantasyRPGHero',
      bio: 'Embarking on epic quests and vanquishing foes in the realm of fantasy RPGs. Champion of mythical worlds and wielder of legendary weapons, destined for greatness!',
      email: 'juan_rodriguez@example.com',
      avatar: '../../uploads/user11.jpg',
      password: 'password11',
      isActivated: true,
    },
    {
      username: 'PixelEnthusiast',
      bio: 'Enthusiast of pixel art and retro aesthetics. Creating nostalgic visuals and embracing the charm of old-school gaming. A pixel aficionado in a digital landscape',
      email: 'carmen_perez@example.com',
      avatar: '../../uploads/user12.jpg',
      password: 'password12',
      isActivated: true,
    },
    {
      username: 'QueerTechie',
      bio: 'Tech enthusiast advocating for LGBTQ+ representation in the tech industry. Harnessing technology for social change and promoting diversity in STEM fields.',
      email: 'alberto_martin@example.com',
      avatar: '../../uploads/user13.jpg',
      password: 'password13',
      isActivated: true,
    },
    {
      username: 'BinaryBard',
      bio: 'Maestro of binary code and digital wizardry. Harnessing the power of zeros and ones to create digital wonders and unlock technological mysteries.',
      email: 'elena_gomez@example.com',
      avatar: '../../uploads/user14.jpg',
      password: 'password14',
      isActivated: true,
    },
    {
      username: 'DataDiver',
      bio: 'Delving into data depths to uncover insights and trends. Navigating through datasets with precision and extracting valuable knowledge from the digital ocean.',
      email: 'pablo_rodriguez@example.com',
      avatar: '../../uploads/user15.jpg',
      password: 'password15',
      isActivated: true,
    },
    {
      username: 'PridePixel',
      bio: 'Celebrating LGBTQ+ pride through pixel art and digital creativity. Spreading love and inclusivity in virtual spaces, one pixel at a time.',
      email: 'irene_sanchez@example.com',
      avatar: '../../uploads/user16.jpg',
      password: 'password16',
      isActivated: true,
    },
    {
      username: 'KawaiiKitty',
      bio: 'Embracing cuteness and charm in the digital world. A playful spirit with a love for all things kawaii, from adorable characters to colorful animations.',
      email: 'sergio_martin@example.com',
      avatar: '../../uploads/user17.jpg',
      password: 'password17',
      isActivated: true,
    },
    {
      username: 'LootLord',
      bio: ' Master of loot and treasures in the gaming realm. Conquering dungeons and amassing riches, one epic loot drop at a time. A true lord of the virtual hoard!',
      email: 'clara_gomez@example.com',
      avatar: '../../uploads/user18.jpg',
      password: 'password18',
      isActivated: true,
    },
    {
      username: 'GlitchGoblin',
      bio: 'Embracing the quirks and anomalies of digital worlds. Harnessing the power of glitches and exploits to navigate through game realms and bend reality.',
      email: 'daniel_rodriguez@example.com',
      avatar: '../../uploads/user19.jpg',
      password: 'password19',
      isActivated: true,
    },
    {
      username: 'GameNightGuru',
      bio: ' Curator of epic game nights and ultimate gaming experiences. Bringing friends together for unforgettable adventures filled with laughter, competition, and camaraderie.',
      email: 'alba_perez@example.com',
      avatar: '../../uploads/user20.jpg',
      password: 'password20',
      isActivated: true,
    },
    {
      username: 'ShinigamiScribe',
      bio: 'Channeling the spirit of the Shinigami into written tales and digital stories. Weaving narratives of life, death, and the supernatural with a touch of darkness and intrigue.',
      email: 'juanita_martin@example.com',
      avatar: '../../uploads/user21.jpg',
      password: 'password21',
      isActivated: true,
    },
    {
      username: 'LevelUpLegend',
      bio: ' Ascending through levels and conquering challenges with legendary prowess. A seasoned adventurer with a knack for achieving greatness in the gaming world.',
      email: 'raul_gomez@example.com',
      avatar: '../../uploads/user22.jpg',
      password: 'password22',
      isActivated: true,
    },
    {
      username: 'DungeonCrawlerDynamo',
      bio: 'Fearlessly delving into dungeons and conquering monsters with skill and strategy. A dynamo of exploration and adventure in the depths of virtual worlds.',
      email: 'sofia_rodriguez@example.com',
      avatar: '../../uploads/user23.jpg',
      password: 'password23',
      isActivated: true,
    },
    {
      username: 'CatanConnoisseur',
      bio: 'Connoisseur of Settlers of Catan and master of resource management. Building empires and forging alliances in the quest for victory on the island of Catan.',
      email: 'adrian_sanchez@example.com',
      avatar: '../../uploads/user24.jpg',
      password: 'password24',
      isActivated: true,
    },
    {
      username: 'DragonDreamer',
      bio: 'Dreaming of dragons and mythical realms where legends come to life. A visionary adventurer with a passion for fantasy and imagination.',
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

  console.log(chalk.green('Table users created and populated with some users.'))
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
        'https://media.istockphoto.com/id/1059088660/es/foto/garantizaremos-que-su-pregunta-obtiene-respuesta.jpg?s=612x612&w=0&k=20&c=ca9ma5FxudtqSKoe_66cYqHRcx73Vspm6bln55evB2s=',
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
        'https://plus.unsplash.com/premium_photo-1675257062614-c1da6b8d83ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2FtaW5nfGVufDB8fDB8fHww',
      theme: 'Online Events',
      location: 'A Coruña',
      address: 'Virtual Event',
      date: '2024-03-10',
      time: '20:00:00',
      organizer_id: 4,
    },
    {
      title: 'Virtual Reality Expo',
      description:
        'Dive into the world of virtual reality! Experience the latest VR innovations and connect with like-minded individuals.',
      picture:
        'https://plus.unsplash.com/premium_photo-1663091704223-cc051e0f0c47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dnJ8ZW58MHx8MHx8fDA%3D',
      theme: 'Online Events',
      location: 'La Laguna',
      address: 'Virtual Event',
      date: '2024-03-25',
      time: '16:00:00',
      organizer_id: 1,
    },
    {
      title: 'Board Game Night',
      description:
        'Grab your favorite digital board game and join us for a night of strategy, fun, and friendly competition.',
      picture:
        'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9hcmQlMjBnYW1lfGVufDB8fDB8fHww',
      theme: 'Online Events',
      location: 'Lisboa',
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
        'https://images.unsplash.com/photo-1576438977080-b015e72145d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fGNvc3BsYXl8ZW58MHx8MHx8fDA%3D',
      theme: 'Online Events',
      location: 'Lisboa',
      address: 'Virtual Event',
      date: '2024-04-05',
      time: '17:30:00',
      organizer_id: 5,
    },
    {
      title: 'Virtual Tech Symposium',
      description:
        'Participate in a virtual symposium discussing the latest trends and innovations in technology. Join us for insightful talks and engaging discussions!',
      picture:
        'https://media.istockphoto.com/id/610966282/es/foto/chica-mirando-en-el-caj%C3%B3n-del-escritorio.jpg?s=612x612&w=0&k=20&c=c_HCvHuGG2sthWBixm_E8ddDOrh-QalDgLT-Rv6kXTQ=',
      theme: 'Online Events',
      location: 'Tokio',
      address: 'Virtual Event',
      date: '2024-04-10',
      time: '18:30:00',
      organizer_id: 6,
    },
    {
      title: 'Digital Gaming Expo',
      description:
        'Immerse yourself in the world of digital gaming! Explore new releases, connect with gaming communities, and experience the excitement of virtual gaming.',
      picture:
        'https://images.unsplash.com/photo-1652197881268-d625ad54402b?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      theme: 'Online Events',
      location: 'Praga',
      address: 'Virtual Event',
      date: '2024-04-15',
      time: '19:00:00',
      organizer_id: 17,
    },
    {
      title: 'Virtual Reality Workshop',
      description:
        'Learn and create in our virtual reality workshop. Dive into the basics of VR development and explore the limitless possibilities of virtual reality!',
      picture:
        'https://images.unsplash.com/photo-1605714048976-892f6b95320e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHZyfGVufDB8fDB8fHww',
      theme: 'Online Events',
      location: 'Amsterdam',
      address: 'Virtual Event',
      date: '2024-04-20',
      time: '17:30:00',
      organizer_id: 18,
    },
    {
      title: 'DnD Campaign',
      description:
        'Join us for a digital board game extravaganza! Explore a variety of digital board games, make new friends, and enjoy a night of gaming fun.',
      picture:
        'https://images.unsplash.com/photo-1549056572-75914d5d5fd4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGJvYXJkJTIwZ2FtZXxlbnwwfHwwfHx8MA%3D%3D',
      theme: 'Online Events',
      location: 'Lima',
      address: 'Virtual Event',
      date: '2024-04-25',
      time: '20:00:00',
      organizer_id: 19,
    },
    {
      title: 'Virtual Cosplay Party',
      description:
        'Get ready for a virtual cosplay party! Dress up as your favorite characters and join us for a night of fun, creativity, and cosplay showcases.',
      picture:
        'https://images.unsplash.com/photo-1505847705282-2c3a20717a69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29zcGxheSUyMHBhcnR5fGVufDB8fDB8fHww',
      theme: 'Online Events',
      location: 'Toronto',
      address: 'Virtual Event',
      date: '2024-05-01',
      time: '19:30:00',
      organizer_id: 10,
    },

    // Videogames
    {
      title: 'Gaming Marathon',
      description:
        'Embark on a gaming marathon with fellow gamers. Play, compete, and share your gaming experiences!',
      picture:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXNwb3J0c3xlbnwwfHwwfHx8MA%3D%3D',
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
        'https://images.unsplash.com/photo-1605134550917-5fe8cf25a125?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvJTIwZ2FtaW5nfGVufDB8fDB8fHww',
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
        'https://images.unsplash.com/photo-1587095951604-b9d924a3fda0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZXNwb3J0c3xlbnwwfHwwfHx8MA%3D%3D',
      theme: 'Videogames',
      location: 'Praga',
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
        'https://plus.unsplash.com/premium_photo-1687881775384-74ec3b09e9d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kaWUlMjBnYW1lfGVufDB8fDB8fHww',
      theme: 'Videogames',
      location: 'Amsterdam',
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
        'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZpZGVvZ2FtZXN8ZW58MHx8MHx8fDA%3D',
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
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D',
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
        'https://plus.unsplash.com/premium_photo-1661898424988-a5f6d40d3db2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D',
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
        'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D',
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
        'https://plus.unsplash.com/premium_photo-1678566111481-8e275550b700?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D',
      theme: 'Technology',
      location: 'Toronto',
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
        'https://plus.unsplash.com/premium_photo-1683121696175-d05600fefb85?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D',
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
        'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Qm9hcmQlMjBHYW1lc3xlbnwwfHwwfHx8MA%3D%3D',
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
        'https://plus.unsplash.com/premium_photo-1677671874468-2dfb9d94c948?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hcmQlMjBnYW1lfGVufDB8fDB8fHww',
      theme: 'Board Games',
      location: 'A Coruña',
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
        'https://images.unsplash.com/photo-1577897113292-3b95936e5206?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJvYXJkJTIwZ2FtZXxlbnwwfHwwfHx8MA%3D%3D',
      theme: 'Board Games',
      location: 'Lima',
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
        'https://plus.unsplash.com/premium_photo-1663051434221-b2d6bf2fc9ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzN8fGJvYXJkJTIwZ2FtZXxlbnwwfHwwfHx8MA%3D%3D',
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
        'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9hcmQlMjBnYW1lJTIwdmlydHVhbHxlbnwwfHwwfHx8MA%3D%3D',
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
        'https://images.unsplash.com/photo-1658999185075-3d24b187643f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q29udmVudGlvbnMlMjBhbmQlMjBDb3NwbGF5fGVufDB8fDB8fHww',
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
        'https://images.unsplash.com/photo-1625189659340-887baac3ea32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YW5pbWUlMjBleHBvfGVufDB8fDB8fHww',
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
        'https://images.unsplash.com/photo-1531501410720-c8d437636169?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29taWN8ZW58MHx8MHx8fDA%3D',
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
        'https://images.unsplash.com/photo-1665384051434-a22ca89fe5c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaWV2YWwlMjBmYWlyfGVufDB8fDB8fHww',
      theme: 'Conventions and Cosplay',
      location: 'Londres',
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
        'https://images.unsplash.com/photo-1628026553588-3af8f47d4d10?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    chalk.green('Table Meetups created and populated with some meetups.'),
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
    { user_id: 1, meetup_id: 1, username: 'CyberGamer92' },
    { user_id: 2, meetup_id: 2, username: 'TechGeekXpert' },
    { user_id: 3, meetup_id: 3, username: 'EqualityEmissary' },
    { user_id: 4, meetup_id: 4, username: 'BoardGameJunkie' },
    { user_id: 5, meetup_id: 5, username: 'CodeWarlock77' },
    { user_id: 6, meetup_id: 6, username: 'RetroGamerRevival' },
    { user_id: 7, meetup_id: 7, username: 'CardGameMaestro' },
    { user_id: 8, meetup_id: 8, username: 'DigiArtisan2021' },
    { user_id: 9, meetup_id: 9, username: 'GameDevNerd99' },
    { user_id: 10, meetup_id: 10, username: 'EsportsFanaticX' },
    { user_id: 11, meetup_id: 11, username: 'FantasyRPGHero' },
    { user_id: 12, meetup_id: 12, username: 'PixelEnthusiast' },
    { user_id: 13, meetup_id: 13, username: 'QueerTechie' },
    { user_id: 14, meetup_id: 14, username: 'BinaryBard' },
    { user_id: 15, meetup_id: 15, username: 'DataDiver' },
    { user_id: 16, meetup_id: 16, username: 'PridePixel' },
    { user_id: 17, meetup_id: 17, username: 'KawaiiKitty' },
    { user_id: 18, meetup_id: 18, username: 'LootLord' },
    { user_id: 19, meetup_id: 19, username: 'GlitchGoblin' },
  ]

  const attendeesToInsert = [
    { meetup_id: 1, user_id: 1, username: 'CyberGamer92', will_attend: true },
    { meetup_id: 1, user_id: 2, username: 'TechGeekXpert', will_attend: true },
    {
      meetup_id: 1,
      user_id: 3,
      username: 'EqualityEmissary',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 4,
      username: 'BoardGameJunkie',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 6,
      username: 'RetroGamerRevival',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 7,
      username: 'CardGameMaestro',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 8,
      username: 'DigiArtisan2021',
      will_attend: true,
    },
    { meetup_id: 1, user_id: 9, username: 'GameDevNerd99', will_attend: true },
    {
      meetup_id: 1,
      user_id: 10,
      username: 'EsportsFanaticX',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 11,
      username: 'FantasyRPGHero',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 12,
      username: 'PixelEnthusiast',
      will_attend: true,
    },
    { meetup_id: 1, user_id: 13, username: 'QueerTechie', will_attend: true },
    { meetup_id: 1, user_id: 14, username: 'BinaryBard', will_attend: true },
    { meetup_id: 1, user_id: 16, username: 'PridePixel', will_attend: true },
    { meetup_id: 1, user_id: 17, username: 'KawaiiKitty', will_attend: true },
    { meetup_id: 1, user_id: 18, username: 'LootLord', will_attend: true },
    { meetup_id: 1, user_id: 19, username: 'GlitchGoblin', will_attend: true },
    { meetup_id: 1, user_id: 20, username: 'GameNightGuru', will_attend: true },
    {
      meetup_id: 1,
      user_id: 11,
      username: 'ShinigamiScribe',
      will_attend: true,
    },
    { meetup_id: 1, user_id: 12, username: 'LevelUpLegend', will_attend: true },
    {
      meetup_id: 1,
      user_id: 13,
      username: 'DungeonCrawlerDynamo',
      will_attend: true,
    },
    {
      meetup_id: 1,
      user_id: 14,
      username: 'CatanConnoisseur',
      will_attend: true,
    },
    { meetup_id: 1, user_id: 25, username: 'DragonDreamer', will_attend: true },
    {
      meetup_id: 2,
      user_id: 3,
      username: 'EqualityEmissary',
      will_attend: true,
    },
    {
      meetup_id: 2,
      user_id: 4,
      username: 'BoardGameJunkie',
      will_attend: true,
    },
    {
      meetup_id: 3,
      user_id: 3,
      username: 'EqualityEmissary',
      will_attend: true,
    },
    { meetup_id: 3, user_id: 1, username: 'CyberGamer92', will_attend: true },
    { meetup_id: 5, user_id: 2, username: 'TechGeekXpert', will_attend: true },
    {
      meetup_id: 5,
      user_id: 3,
      username: 'EqualityEmissary',
      will_attend: true,
    },
    {
      meetup_id: 5,
      user_id: 4,
      username: 'BoardGameJunkie',
      will_attend: true,
    },
    {
      meetup_id: 5,
      user_id: 5,
      username: 'RetroGamerRevival',
      will_attend: true,
    },
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
