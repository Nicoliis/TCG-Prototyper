# List of expected features:
1. Prototype group
2. Card type design
3. Card filling via csv
4. Deckbuilding
5. Card proxy printing
6. Playing field designer
7. Online, testing

# 1- Prototype group
The app will be able to hold and load multiple proyects per user.
Each proyect will be completly independent from each other.
Proyects can be created, dupicated, deleted.

# 2- Card type design
For each proyect you can create N card types.
Each card type will have properties, and a layout.
The layout will have displays, labels, images.

## Displays:
Text displays: will show a value passed by a template: 
  - {val}: will show the property val
  - {atk}/{def}: will show the atk value/def value, 
  - so on and so forth.

Image displays: Will show an image in the field.
  - It will take the value and attempt to load an image.
  - {imgurl}: will attempt to fetch that image.
  - https://myurl.com/{imgurl}: will attempt to fetch the resulting url, etc.
  - {imgnumb:templatex}: will get the templatex slice it like a spritesheet and take the image number imgnumb.

Image list: Will show one instance of a predetermined imagelist.
 - The image list will be determined beforehand.
 - For things like attibute icon, or background color, card border, etc.
 - The field will takea a default and map input text to image.

## Labels
Labels are raw static values for the cards

## Images/Icons
Are static images or icons of the card.

# 3- Card filling via csv
The app will have a section to fill cards via a csv, and a minuscule csv editor to simplify the construction of cards.
And you will be able to import CSVs
Those CSVs will map all collumns to properties, if the property is not defined it will ignore and it will leave empty every property not informed.

# 4- Deckbuilding
There will be a seciton of deckbuilding, the cards will be able to be sorted in N decks that can be named.

# 5- Card proxy printing
You will be able to print cards on demand (choosing manually one by one), or creating a big proxi print for an entire deck.

# 6- Playing field designer
For the playing field you will design areas with properties.
- There is always a private hand.
- Sizes will be defined in CW(card width) and CH(Card height) so a 1x1 is 1CW x 1CH.
- First you choose if they are a stack or an area
- You place them relatively to eachother without overlap to define the field.
- Areas can be player or shared
  - Player areas are defined in your side and again rotated 180 for the opponent.
  - Shared areas are present only once.

## For stacks:
- Stacks are 1x1.
- Can be defined as "face down"(like decks) and "face up"(like discards).

## For areas:
- Areas sizes are defined by it's CWxCH.
- Area cells are squares that are the largest between the CW and CH.
- Areas will define if they are cell defined or free space.
  - Cell defined means the area will only hold perfectly aligned cards in their positions.
  - Free space means cards can be manipulated pixelwhise.
- Areas will define if they are public or private information, (if the oponent can see there)

# 7- Online, testing
Allow to playtest the game by sharing link, use local state and a p2p connection for those with the link.
on enter they choose their side and are able to apply acitons over their areas and the general ones.

## Actions over stack
- See (will list all cards)
- Shuffle.
- Draw first (can be done by dragging from deck to hand)

## Actions over cards in list/areas
- Add to hand
- Move to stack: then choose stack

## Actions over hand
- Move to stack: then chose stack (can be replaced by dragging to stack)
- Drag to area: choose if faceup/facedown, straight/sideways.


Besides suggest any action i might have missed, that is "game agnostic" (needed for manipulation without rule implication).
