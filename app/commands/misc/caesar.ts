import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import LanguageDetect from "languagedetect";

const lngDetector = new LanguageDetect();

class Caesar
{

  private static alphabetRangeChar = ['A', 'Z'];
  private static alphabetFirstCharCode = this.alphabetRangeChar[0].charCodeAt(0);
  private static alphabetLastCharCode  = this.alphabetRangeChar[1].charCodeAt(0);
  private static alphabetSize = this.alphabetLastCharCode - this.alphabetFirstCharCode + 1;

  /**
   *  Normalize text entry by removing special 
   *  characters such as accented characters and 
   *  transform the string to uppercase.
   * 
   *  Example :
   *    INPUT  => Je suis allé chercher une baguette à la farine de blé.
   *    OUTPUT => JE SUIS ALLE CHERCHER UNE BAGUETTE A LA FARINE DE BLE.
   */
  private static normalizeTextEntry( text: string ) : string
  {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  }

  /**
   *  TODO : Write a fucking description and find 
   *  a fucking method name !
   */
  public static encrypt( text: string, shift: number ) : string
  {
    const normalizedText = this.normalizeTextEntry(text);

    return normalizedText.split("").map((currentChar) => {
      const currentCharCode = currentChar.charCodeAt(0);

      if(currentChar >= this.alphabetRangeChar[0] && currentChar <= this.alphabetRangeChar[1])
      {
        return String.fromCharCode(
          ((currentCharCode - this.alphabetFirstCharCode + shift) % this.alphabetSize) + this.alphabetFirstCharCode
        );
      }

      // Spaces / Ponctuations / ...
      return currentChar;
    }).join("");
  }

  /**
   *  TODO : Write a fucking description and find 
   *  a fucking method name !
   */
  public static decrypt( text: string ) : string | null
  {
    const candidatesQueue = [];

    for(let shift = 0; shift < this.alphabetSize; shift++)
    {
      const decrypted = this.encrypt(text, (this.alphabetSize - shift));
      const [ lang, score ] = lngDetector.detect(decrypted, 1)[0];

      if(lang === 'french') {
        console.log(shift);
        candidatesQueue.push({ decrypted, score });
      }
      else {
        // nothing bordel
      }
    }

    return candidatesQueue[0].decrypted;
  }

}

export default
{
  data: (
    new SlashCommandBuilder()
        .setName("caesar")
        .setDescription("Une commande pour chiffrer ou déchiffrer un caesar code. Mention spéciale à galactic_dust")
        .addSubcommand(subcommand =>
          subcommand
            .setName('--encrypt')
            .setDescription('Transforme ton texte en code secret grâce au chiffrement César.')
            .addStringOption(option => option.setName('sentence').setDescription('Ne mâchez pas vos mots !').setRequired(true))
            .addNumberOption(option => option.setName('shift').setDescription('Le décalage à utiliser !').setMinValue(1).setMaxValue(25))
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('--decrypt')
            .setDescription('Décrypte n\'importe quel message codé avec la méthode César')
            .addStringOption(option => option.setName('sentence').setDescription('Ne mâchez pas vos mots !').setRequired(true))
        )
  ),

  execute: async (interaction : ChatInputCommandInteraction) => {
    if(interaction.options.getSubcommand() === '--encrypt')
    {
      const sentence = interaction.options.getString('sentence') as string;
      const shift = interaction.options.getNumber('shift') ?? 3;

      await interaction.reply(`${Caesar.encrypt(sentence, shift)}`);
    }

    if(interaction.options.getSubcommand() === '--decrypt')
    {
      const sentence = interaction.options.getString('sentence') as string;
      const finded = Caesar.decrypt(sentence);

      await interaction.reply(`${finded}`);
    }
  }
};