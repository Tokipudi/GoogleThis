export interface SearchResponse {
    results: Results,
    did_you_mean?: string,
    knowledge_panel: KnowledgePanel,
    featured_snippet: FeaturedSnippet,
    top_stories: TopStories,
    people_also_ask: Array<string>,
    people_also_search_for: Array<string>,
    dictionary: Dictionary,
    translation: Translation,
    unit_converter: UnitConverter
}

export interface Result {
    title?: string,
    description?: string,
    url?: string,
    favicons?: FavIcons
}
export interface Results extends Array<Result> { }

export interface FavIcons {
    high_res: string,
    low_res: string
}

export interface KnowledgePanel {
    title: string,
    description: string,
    url: string,
    born: string,
    died: string,
    spouse: string,
    children: string,
    parents: string,
    type: string,
    books,
    tv_shows_and_movies
}

export interface FeaturedSnippet {
    title: string,
    description: string,
    url: string
}

export interface TopStory { }
export interface TopStories extends Array<TopStory> { }

export interface Dictionary {
    word: string,
    phonetic: string,
    audio: string,
    definitions: Array<string>,
    examples: Array<string>
}

export interface Translation {
    source_language: string,
    target_language: string,
    source_text: string,
    target_text: string
}

export interface UnitConverter {
    input: string,
    output: string,
    formula: string
}