/* declarations */
const { Client, Intents, MessageActionRow, MessageButton } = require('discord.js');
const { token } = require('./config.json');
const { TicTacToe } = require('./databaseObjects.js');
const axios = require('axios');
const Discord = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log('Ready!');
})
/* declarations end */

/* ping pong boom bam*/
client.on('messageCreate', (message) => {
    if(message.author.id === client.user.id) return;

    if(message.content === "ping") {
        message.reply("pong");
    }
})

client.on('messageCreate', (message) => {
    if(message.author.id === client.user.id) return;

    if(message.content === "boom") {
        message.reply("bam");
    }
})
/* ping pong boom bam end */



/* tictactoe */
let EMPTY = Symbol("empty")
let PLAYER = Symbol("player")
let BOT = Symbol("bot")

let tictactoe_state 

function makeGrid() {
    components = []

    for (let row = 0; row < 3; row++) {
        actionrow = new MessageActionRow()

        for (let col = 0; col < 3; col++){
            messageButton = new MessageButton()
                .setCustomId('tictactoe_' + row + '_' + col)


            switch(tictactoe_state[row][col]){
                case EMPTY:
                    messageButton
                        .setLabel(' ')
                        .setStyle('SECONDARY')
                    break;
                case PLAYER:
                    messageButton
                        .setLabel('X')
                        .setStyle('PRIMARY')
                    break;
                case BOT:
                    messageButton
                        .setLabel('O')
                        .setStyle('DANGER')
                    break;

            }
            actionrow.addComponents(messageButton)
        }
    
        components.push(actionrow)
    }
    return components
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function isDraw(){
    for( let row = 0; row < 3; row++){
        for(let col = 0; col < 3; col++) {
            if(tictactoe_state[row][col] == EMPTY){
                return false;
            }
        }
    }
    return true;
}

function isGameOver(){
    for(let i = 0; i < 3; i++){
        if(tictactoe_state[i][0] == tictactoe_state[i][1] && tictactoe_state[i][1] == tictactoe_state[i][2] && tictactoe_state[i][2] != EMPTY){
            return true;
        }

        if(tictactoe_state[0][i] == tictactoe_state[1][i] && tictactoe_state[1][i] == tictactoe_state[2][i] && tictactoe_state[2][i] != EMPTY){
            return true;
        }
    }

    if(tictactoe_state[1][1] != EMPTY){
        if(
            (tictactoe_state[0][0] == tictactoe_state[1][1] && tictactoe_state[1][1] == tictactoe_state[0][2]) || 
            (tictactoe_state[2][0] == tictactoe_state[1][1] && tictactoe_state[1][1] == tictactoe_state[0][2])) {
            return true;
        }
    }


    return false;
}

client.on('interactionCreate', async interaction => {
    if(!interaction.isButton()) return;
    if(!interaction.customId.startsWith('tictactoe')) return;

    if (isGameOver()){

        interaction.update({
            components: makeGrid()
        })
        return;
    }

    let parseFields = interaction.customId.split("_")
    let row = parseFields[1]
    let col = parseFields[2]


    if(tictactoe_state[row][col] != EMPTY){
        interaction.update({
            content: "You can't select that square",
            components: makeGrid()
        })
        return;
    }

    tictactoe_state[row][col] = PLAYER;

    if (isGameOver()){

        let user = await TicTacToe.findOne({
            while: {
                user_id: interaction.user.id
            }
        });
        if(!user){
            user = await TicTacToe.create({user_id: interaction.user.id });
        }

        await user.increment('score');

        interaction.update({
            content: "You won the game of tic-tac-toe! You have won " + (user.get('score') + 1) + " time(s).",
            components: []
        })
        return;
    }

    if (isDraw()){
        interaction.update({
            content: "The game resulted in a draw!",
            components: []
        })
        return;
    }


    /* Bot Functionality */
    let botRow
    let botCol

    do{
        botRow = getRandomInt(3);
        botCol = getRandomInt(3);
    } while(tictactoe_state[botRow][botCol] != EMPTY);

    tictactoe_state[botRow][botCol] = BOT;

    /* Bot Functionality end */
    

    if (isGameOver()){

        interaction.update({
            content: "You Lost the game of tic-tac-toe!",
            components: makeGrid()
        })
        return;
    }

    if (isDraw()){
        interaction.update({
            content: "The game resulted in a draw!",
            components: []
        })
        return;
    }
    interaction.update({
        components: makeGrid()
    })

})

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand ()) return;

    const { commandName } = interaction;

    if (commandName === 'tictactoe') { 
        

        tictactoe_state = [
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]
        ]
        
        await interaction.reply({content : 'Playing a game of tic-tac-toe!', components: makeGrid() });
    }
})

/* tictactoe end */

/* meme */

memes: [
    {
    subreddit: 'memes',
        title: 'Have a Snickers',
        upvotes: 15122,
        url: 'https://i.redd.it/tde2okjfyaz61.jpg'
      }
    ]
  client.on('messageCreate', async msg => {
  async function getMeme(){
    const res = await axios.get('https://memeapi.pythonanywhere.com/');
    return res.data.memes[0].url;
  }
  
  if(msg.content === "!meme"){
      msg.channel.send("Here's your meme!");
      const img = await getMeme();
      msg.channel.send(img);
     }
    })
/* meme end */

client.login(token);

