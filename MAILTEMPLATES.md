# Mail- en documenttemplates

De inhoud van het Google Document is de basis van de uiteindelijke e-mail en,
waar van toepassing, de documentkopie. Alle gewone tekst en opmaak uit de
template blijven staan. Alleen placeholders tussen `@`-tekens worden vervangen.

Placeholders zijn niet hoofdlettergevoelig. `@voorganger@`, `@Voorganger@` en
`@VOORGANGER@` betekenen dus hetzelfde. Houd een placeholder binnen één
tekstopmaak; maak bijvoorbeeld niet de helft vet en de andere helft normaal.

## Variabelen van de eerstvolgende dienst

| Placeholder | Inhoud |
|---|---|
| `@datum@` | Volledige Nederlandse datum |
| `@tijd@` | Aanvangstijd |
| `@datumtijd@` | Datum en tijd |
| `@voorganger@` | Voorganger |
| `@bijzonderheden@` | Bijzonderheden |
| `@collecte@` | Collectedoel |
| `@collectecategorie@` | Collectecategorie |
| `@uitgangscollecte@` | Uitgangscollecte |
| `@lector@` | Lector |
| `@ambtsdragers@` | Ouderling en eventuele extra ambtsdrager |
| `@koster@` | Koster |
| `@koffie@` | Koffiezetters |
| `@ontvangst@` | Ontvangst |
| `@klokkenluider@` | Klokkenluider |
| `@kerktv@` | KerkTV-regisseur |
| `@kleur@` | Liturgische kleur |
| `@heiligavondmaal@` | `ja` of `nee` |
| `@avondmaalsvorm@` | Vorm van het Heilig Avondmaal |
| `@naamzondag@` | Naam van de zondag |
| `@kwartaal@` | Kwartaalnummer |
| `@koffiedienst@` | `ja` of `nee` |
| `@didamdienst@` | `ja` of `nee` |

De oude aliases `@ha@`, `@havorm@` en `@zondagnaam@` blijven voorlopig
ondersteund.

## Meerdere diensten

`@gegevens@` maakt normaal een verticaal overzicht van de eerstvolgende dienst.

`@gegevens 3@` of `@gegevens 3 @` maakt hetzelfde overzicht voor de
eerstvolgende drie diensten.
Het getal mag naar behoefte worden aangepast. Lege velden worden in dit
overzicht overgeslagen.

Voor kerkmededelingen gelden aanvullende datumregels:

- losse placeholders, zoals `@voorganger@`, horen bij de eerstvolgende zondag;
- zijn er diensten van donderdag tot en met zondag in dezelfde week, dan toont
  een kaal `@gegevens@` alle diensten in die periode;
- valt Eerste Kerstdag vóór die zondag en staat die dienst op de Voorpagina,
  dan worden de losse placeholders en `@gegevens@` op Eerste Kerstdag gebaseerd;
- een expliciet aantal, bijvoorbeeld `@gegevens 2@`, blijft dat aantal gebruiken.

Het dienstenoverzicht heeft een vaste veldvolgorde. Bijzonderheden worden met
een komma achter de voorganger geplaatst. De ja/nee-velden worden niet als
afzonderlijke regels weergegeven:

- bij `Koffiedienst = nee` wordt `Koffie: geen koffie` weergegeven;
- bij `Dienst in Didam = nee` blijven alleen werkelijk gevulde velden staan;
- bij `Heilig Avondmaal = ja` wordt `Heilig Avondmaal` aan de bijzonderheden
  toegevoegd.

## Aanvullende placeholders

Afhankelijk van het type mail zijn onder andere beschikbaar:

- `@onderwerp@`, `@titel@`, `@mededeling@` en `@liturgie@`;
- `@archief@`, `@contactgegevens@` en `@kerktvpagina@` voor KerkTV;
- `@organist@`, `@bloemen@`, `@extra_mededelingen@` en `@url_edit@` voor
  mededelingen;
- `@kerkdiensten@`, `@activiteiten@` en `@beschrijving@` voor het MJ;
- `@samenvatting@`, `@details@` en `@periode@` voor Liemersactiviteiten.

Een onbekende placeholder stopt de verzending. De foutmelding noemt de
onbekende naam, zodat een typefout niet ongemerkt in een verzonden mail komt.

## Testtemplate

Vul op het werkblad **Configuratie** bij `Template-ID - Testmail` het
Google Document-ID van een aparte testtemplate in. Kies daarna in het menu
**Dienstenrooster → Testen → Verzend testtemplate**.

De testmail:

- gebruikt echte roosterwaarden van de eerstvolgende dienst(en);
- ondersteunt ook `@gegevens <n>@`;
- vult alle aanvullende placeholders met duidelijk herkenbare `TEST`-waarden;
- wordt uitsluitend verzonden naar de adressen uit `Testmail`;
- stopt vóór verzending als de template een onbekende placeholder bevat.

Hiermee kan één testtemplate alle hierboven beschreven placeholders bevatten.

Alle andere opdrachten in het menu **Testen** gebruiken eveneens de instelling
`Testmail`. De waarde is een kommagescheiden lijst, aanvankelijk:
`avandervliet@gmail.com, avandervliet@xs4all.nl`.

## Kerkmededelingen: twee templates

Kerkmededelingen gebruiken twee afzonderlijke Google Document-templates:

- `Template-ID - Mededelingen mail` bepaalt alle tekst en opmaak van de mail;
- `Template-ID - Mededelingen document` bepaalt de mededelingenbijlage die als
  `.docx` wordt meegestuurd.

Beide templates gebruiken dezelfde placeholders. Losse variabelen gebruiken de
hoofddienst; het `@gegevens@`-blok kan volgens de bovenstaande regels meerdere
diensten bevatten. Het oude `Template-ID - Mededelingen` wordt bij migratie als
documenttemplate behouden. Het ID van **Mededelingen Mail** moet afzonderlijk
worden ingevuld.
