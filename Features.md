



## I. Features



#### 1. Import / Add Files

Prepares and imports files into the project. 

##### Process

1. Start Import Process
2. Select all Files to import in File-Selection-Dialog
3. Option to move imported files
   - keep in same directory
   - move to target directory
   - copy to target directory
4. Option to rename imported files
   - input field for center, middle and end with option to select type
   - types: nothing, text, original filename, count up from, ... 
5. Option to already write default values of custom fields into file metadata
6. "Accept" to start import (in background -> show current status in info-bar and notification when done)

##### Notes

- keep file and image metadata when moving and copying files
- generate thumbnails and preview images during import





#### 2. Refresh

Reloads the data of an element in the project, e.g. when changing the metadata or an image without the project.

##### Process

1. Select files to refresh
2. Start refresh process
3. Confirm (dialog with info: how many and list of all affected files)
4. Refresh runs in background -> show current status in info-bar and notification when done





#### 3. Embed

Writes field-values into the file(s)

##### Process

1. Select files
2. Start embed process
3. Confirm (dialog with info: how many and list of affected files)
4. Embed runs in background -> show current status in info-bar and notification when done





#### 4. Export

Copies the files to another directory

##### Process

1. Select files to export
2. Start export process
3. select target directory
4. Confirm (dialog with info: how many and list of affected files)
5. Export runs in background -> show current status in info-bar and notification when done

##### Notes

- copied files must be the exact same, i.e. keep filename, metadata, ...





#### 5. Edit Elements

Modify values of fields of any element

##### Process for single element

1. Select file to edit -> open in info-sidebar
2. edit values of key-value-pairs -> value get changed

##### Process for multiple elements

1. Select files to edit -> all open in info-sidebar

2. edit values of key-value-pairs -> value get changed for all files

   



#### 6. Collections

- Collection = Group of elements / Subset of all elements
- Default collections
  - "All Elements" -> Contains all known elements
- Manual Collections
  - Collections organized by hand, i.e. add/remove elements manually
- Automatic Collections
  - Collections generated "at runtime" by search query
  - all elements matching a defined filter

##### Note

- Collections can be organized in Packages / Directories / Groups



## II. Project Handling

Project == "Library" ?

#### 1. Start-Screen: options when opening the application

- **open library:** manually select a project-file to open 
- **open recent**: List of recently opened projects. Select one to open it.
- **create new:** Opens a popup to configure a new project. Does not open settings (settings can be changed at any time after creating the project). Set target directory and project name. 





## III. Project Settings

#### 1. Fields for all elements

- display list of all fields
  - custom fields
  - default fields (e.g. date imported, filename, path, filetype, ...)
- add, remove custom fields
- edit custom fields
  - name
  - type (text, number, date, reference, boolean, ...)
  - whether to show the field in the element list
  - whether to write to file/image metadata (with location, e.g. none, file, exif, xmp, ...)
  - default value

#### 2. Miscellaneous

- Thumbnail image size
  - define width in pixels, height gets calculated automatically for each image (or maybe define size of "longer side")
  - can be changed at any time
  - maybe show rough estimate of "file"-size
- Preview Image size
  - define width in pixels, height gets calculated automatically for each image (or maybe define size of "longer side")
  - can be changed at any time
  - maybe show rough estimate of "file"-size
- Preview image directory
  - set directory where to save preview images





## IV. "Levels of Preview"

1. Thumbnail
   - smallest
   - in database
2. Preview 
   - medium size, jpg
   - saved files in specified directory
3. Original
   - original file
   - might not always be available (saved on external drive)
