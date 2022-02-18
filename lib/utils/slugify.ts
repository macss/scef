export default function slugify(str: string){
  return str.replace(/[^\w\d\s\-]+/g, "")         // Strip invalid characters
            .replace(/_+/g, "-")                  // Replace _ with -
            .replace(/^[\s|\-]+|[\s|\-]+$/, "")   // Trim whitespace
            .replace(/(\s+)/g, ",")               // Replace spaces with , for spliting
            .replace(/([A-Z]+)/g, ",$1")          // Add , between capitals for splitting
            .replace(/^,/, "")                    // Trim off the first comma if one was added
            .split(",")                           // Split it apart
            .join("-")                            // Put it together
            .replace(/-+/g, "-")                  // Get rid of serial -
            .toLowerCase();
};