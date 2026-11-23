# Touchscreen: facts (checked 2026-10-10)
| Claim | Evidence | URL |
|---|---|---|
| grid of rows and columns, a capacitor at each crossing | "consists of X by Y arrays of traces, creating X*Y units of capacitors. It creates a mutual capacitance between the elements of the columns and rows." | riverdi.com/blog/self-or-mutual-capacitive-touchscreen |
| finger takes some of the charge at the crossing | search snippet (canvys.com, page now 404): "some of the mutual capacitance between the row and column is coupled to the finger which reduce the capacitance" ; topwaydisplay.com: "When a finger or a conductive stylus approaches an electrode, it disturbs the electromagnetic field and alters the capacitance." | topwaydisplay.com/en/blog/what-is-projected-capacitive-touchscreen |
| scanning the intersections | "With mutual capacitance you need to scan the intersections of the electrodes, where the rows and columns overlap." | microtouch.com/faq |
| gloves are insulators | "Capacitive touch screens stop working with gloves because the material is an insulator that blocks electrical signals." | us.ktcplay.com/blogs/support-tips/why-gloves-dont-work-on-capacitive-touch-screens |
| water causes false touches | "Water can interfere with a capacitive touch screen by changing the electrical conditions measured by its sensor." | touchpro.us/post/why-don-t-touch-screens-work-when-wet |
To read in full before voice (only snippets opened today): microtouch FAQ, the glove and water pages; and one source for "the body conducts because it is mostly salty water".

## Added for the visual plan (read 2026-10-11)
| On screen | Evidence | URL |
|---|---|---|
| `150 crossings` on a 10 by 15 example, each one scanned | "The 10 rows and 15 columns intersect at 10x15 or 150 intersections, so to scan the entire sensor you would need to scan at every one of those 150 intersections." and "With mutual capacitance, a touch takes some of the charge from the field that is created at the intersection of electrodes." | microtouch.com/faq |
| `120 scans a second` | Apple's own table, Touch Sample Rate: iPhone X 120 hz (older iPhones 60 hz). Tag it `iPhone X and later` | developer.apple.com/library/archive/documentation/DeviceInformation/Reference/iOSDeviceCompatibility/Displays/Displays.html |
| `less than 1 pF` goes missing | "A user's touch disrupts the field between the two electrodes, reducing the coupling between them and removing mutual capacitance." "Typical changes in mutual capacitance due to a touch are small, usually less than 1pF." | TI CapTIvate Technology Guide, Capacitive Sensing Basics (software-dl.ti.com) |
| the thread bridges skin and glass | "The gloves are woven with conductive threads, typically in the fingertips" ; "The conductive thread effectively bridges the gap that's created by your non-conductive gloves" | olympiagloves.com/frigid-fingers-no-more-how-do-touch-screen-gloves-work-jfm |
| water can read as a touch | "Water on the cover surface can change those measurements too." "The controller may interpret water as a touch" | touchpro.us/post/why-don-t-touch-screens-work-when-wet |
| locked iPhone shows `slide to answer` | iOS 17 screenshot, assets/refs/ios17-locked-slide-to-answer-gadgethacks.webp | ios.gadgethacks.com |

Not verified, so never written on screen as a fact: the number of rows and columns in an iPhone, the wire spacing, the
glass thickness, any count value in the phone's raw touch image (all drawn, tagged `illustrative`).
