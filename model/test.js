var var1=5; 
var var2=4; 
var var3=3; 
var var4=2; 

while(var1!=0){
if(var4>0)var4--;
if(var4<=0) {if(var3>0)var3--; }
if(var3<=0) {if(var2>0) var2--; }
if(var2<=0){ if(var1>0) var1--; }
console.log(var1,var2,var3,var4);
}