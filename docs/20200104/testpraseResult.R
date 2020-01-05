args <- commandArgs(TRUE)


Gb_Bac_Taxon.m <- as.matrix(read.csv("all_Taxon.txt", header = F, fill = TRUE, sep = "\t"))
colnames(Gb_Bac_Taxon.m) <- c("SequenceID", "Description", "TaxonID", "Superkingdom", "Phylum", "Class", "Order", "Family", "Genus", "Species")

fileIN <- paste(args[2], "/", args[3], "/", args[4], "_Gb_Arc_Bac_Fun_Vir_mapinfo.txt", sep="");

mapinfo.m <- as.matrix(read.csv(fileIN, header = F, sep = "\t"));

tmp.idx <- match(mapinfo.m[,2], Gb_Bac_Taxon.m[,1])

valid.idx <- which(!is.na(tmp.idx))

tmp1.idx <- tmp.idx[valid.idx]

TaxonDis.m <- Gb_Bac_Taxon.m[tmp1.idx, c(4:10)]
SpeciesDis.v <- as.vector(TaxonDis.m[,7]);

ReadsCount <- sort(table(SpeciesDis.v), decreasing=T)

tmp.idx <- match(names(ReadsCount), Gb_Bac_Taxon.m[,10])

SpeciesCount.m <- cbind(ReadsCount, Gb_Bac_Taxon.m[tmp.idx,c(2:10)])

#SpeciesCountOut.m <- SpeciesCount.m[1:100,]
SpeciesCountOut.m <- SpeciesCount.m

fileOUT <- paste(args[2], "/", args[3], "/", args[4], "_SpeciesCount.csv", sep="" )
write.csv(SpeciesCountOut.m, file=fileOUT)



