import { Client, ApplicationCommandOptionData, Collection, Guild, ChannelType } from "discord.js";

type CategoryTypes = "Games" | "Moderation" | "Owner" | "Picsou" | "Utilities";

interface IData {
    name: string;
    description: string;
    category: CategoryTypes;
    owner: boolean;
    args: boolean;
    slash: boolean;
    options?: ApplicationCommandOptionData[];
}

interface IEmojis {
    error: string;
    warning: string;
}

interface IMessages {
    userInteractionError: string;
    internalError: string;
    error: string;
    saveError: string;
}

interface IUtils {
    readonly fileInfos: any;
    readonly client: Client & I;
    readonly colors: {
        red: "#E11515"
        green: "#4F9721"
        yellow: "FFFF00"
    };
    readonly eventsName: [
        "messageUpdate",
        "messageDelete",
        "messageDeleteBulk",
        "channelCreate",
        "channelDelete",
        "channelUpdate",
        "emojiCreate",
        "emojiDelete",
        "emojiUpdate",
        "guildBanAdd",
        "guildBanRemove",
        "guildIntegrationUpdate",
        "guildMemberAdd",
        "guildMemberRemove",
        "guildMemberUpdate",
        "guildUpdate",
        "inviteCreate",
        "inviteDelete",
        "roleCreate",
        "roleDelete",
        "roleUpdate",
        "stickerCreate",
        "stickerDelete",
        "stickerUpdate",
        "threadCreate",
        "threadDelete",
        "threadUpdate",
        "userUpdate",
        "voiceStateUpdate",
        "webhookUpdate"
    ];
    readonly clientEventsName: [
        "MessageUpdate",
        "MessageDelete",
        "MessageDeleteBulk",
        "ChannelCreate",
        "ChannelDelete",
        "ChannelUpdate",
        "EmojiCreate",
        "EmojiDelete",
        "EmojiUpdate",
        "GuildBanAdd",
        "GuildBanRemove",
        "GuildMemberAdd",
        "GuildMemberRemove",
        "GuildMemberUpdate",
        "GuildUpdate",
        "InviteCreate",
        "InviteDelete",
        "RoleCreate",
        "RoleDelete",
        "RoleUpdate",
        "StickerCreate",
        "StickerDelete",
        "StickerUpdate",
        "ThreadCreate",
        "ThreadDelete",
        "ThreadUpdate",
        "UserUpdate",
        "VoiceStateUpdate",
        "WebhookUpdate"
    ];
    readonly channelsList: {
        [ChannelType.GuildText]: "Textuel",
        [ChannelType.GuildVoice]: "Vocal",
        [ChannelType.GuildCategory]: "Catégorie",
        [ChannelType.GuildNews]: "Salon des annonces",
        [ChannelType.GuildNewsThread]: "Thread d'un salon d'annonces",
        [ChannelType.GuildPublicThread]: "Thread d'un salon publique",
        [ChannelType.GuildPrivateThread]: "Thread d'un salon privé",
        [ChannelType.GuildStageVoice]: "Salon de stage",
      };
    readonly emojis: IEmojis;
    readonly messages: IMessages;
    
    loadCommands(dirCommands?: string): void;
    loadEvents(dirEvent?: string): void;
    createGuild(guild: Guild): void;
    deleteGuild(guild: Guild): void;
    updateGuild(guild: Guild, args: {}): void;
    sleep(ms: number): Promise<void>;
}

interface I {
    readonly commands: Collection<string, Commands>;
    readonly utils: IUtils;
    readonly config: any;
    readonly model: any;
}

declare class Commands {
    public constructor(client: Client, data: IData);
    public readonly client: Client & I;
    public readonly name: string;
    public readonly description: string;
    public readonly category: CategoryTypes;
    public readonly owner: boolean;
    public readonly args: boolean;
    public readonly slash: boolean;
    public readonly options?: ApplicationCommandOptionData[];
}

export = Commands;